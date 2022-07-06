package data

import (
	"sync"
	"time"
	"u-node-mq-termui/src/util"
)

//前端传递的json
type ConsumerLogData struct {
	BaseLogData
	Accepted int    `json:"accepted"` //接收消息的数量，
	Message  string `json:"message"`  //文本说明日志，error 也会使用 message 字段输出
}

//表json
type ConsumerTableField struct {
	TableField
	AcceptedCount int
}

type ConsumerTable struct {
	lock  sync.Mutex
	list  []ConsumerTableField
	State bool //控制是否需要重绘视图
}

var (
	C = ConsumerTable{}
)

//添加数据
//一个id的组件只会创建一次
func (consumerTable *ConsumerTable) Add(ConsumerLogData ConsumerLogData) {
	c := ConsumerTableField{}
	c.Id = ConsumerLogData.Id
	c.CreatedTime = ConsumerLogData.CreatedTime
	c.UpdateTime = time.Now().In(util.CstSh).UnixMilli()
	c.AcceptedCount += ConsumerLogData.Accepted
	consumerTable.list = append(consumerTable.list, c)
	consumerTable.State = true

}

//删除list
func (consumerTable *ConsumerTable) DeleAll() {
	consumerTable.list = []ConsumerTableField{}
	consumerTable.State = true
}

//设置值，如果id不存在，就添加一条
func (consumerTable *ConsumerTable) Set(ConsumerLogData ConsumerLogData) {
	c := consumerTable.Find(ConsumerLogData.Id)
	//是否需要加锁呢？
	consumerTable.lock.Lock()
	if c.Id == "" {
		consumerTable.Add(ConsumerLogData)
	} else {
		c.AcceptedCount += ConsumerLogData.Accepted

		c.UpdateTime = time.Now().In(util.CstSh).UnixMilli()

	}
	consumerTable.State = true

	consumerTable.lock.Unlock()
}

//通过id查找一条数据，返回一条数据的指针
func (consumerTable *ConsumerTable) Find(id string) *ConsumerTableField {
	for i := 0; i < len(consumerTable.list); i++ {
		if id == consumerTable.list[i].Id {
			return &consumerTable.list[i]
		}
	}
	return &ConsumerTableField{}
}

func (consumerTable *ConsumerTable) FindList() []ConsumerTableField {

	return consumerTable.list
}
