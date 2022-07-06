package data

import (
	"sync"
	"time"
	"u-node-mq-termui/src/util"
)

//前端传递的json
type QueueLogData struct {
	BaseLogData
	QueueBaseField
	Message string `json:"message"` //文本说明日志，error 也会使用 message 字段输出
}

//表json
type QueueTableField struct {
	TableField
	QueueBaseField
}

//队列公共字段
type QueueBaseField struct {
	NewsNum     int      `json:"newsNum"`     //当前队列消息总数
	NewsIds     []string `json:"newsIds"`     //当前队列消息 id 数组
	ConsumerNum int      `json:"consumerNum"` //当前消费者数量
	ConsumerIds []string `json:"consumerIds"` //当前消费者 id 数组
}

type QueueTable struct {
	lock  sync.Mutex
	list  []QueueTableField
	State bool
}

var (
	Q = QueueTable{}
)

//添加数据
//一个id的组件只会创建一次
func (queueTable *QueueTable) Add(queueLogData QueueLogData) {
	q := QueueTableField{}
	q.Id = queueLogData.Id
	q.CreatedTime = queueLogData.CreatedTime
	q.Name = queueLogData.Name
	q.UpdateTime = time.Now().In(util.CstSh).UnixMilli()
	q.NewsNum = queueLogData.NewsNum
	q.NewsIds = queueLogData.NewsIds
	q.ConsumerNum = queueLogData.ConsumerNum
	q.ConsumerIds = queueLogData.ConsumerIds
	queueTable.list = append(queueTable.list, q)
	queueTable.State = true

}

//删除list
func (queueTable *QueueTable) DeleAll() {
	queueTable.list = []QueueTableField{}
	queueTable.State = true

}

//设置值，如果id不存在，就添加一条
func (queueTable *QueueTable) Set(queueLogData QueueLogData) {
	q := queueTable.Find(queueLogData.Id)
	//是否需要加锁呢？
	queueTable.lock.Lock()
	if q.Id == "" {
		queueTable.Add(queueLogData)
	} else {
		q.Name = queueLogData.Name
		q.NewsNum = queueLogData.NewsNum
		q.NewsIds = queueLogData.NewsIds
		q.ConsumerNum = queueLogData.ConsumerNum
		q.ConsumerIds = queueLogData.ConsumerIds

		q.UpdateTime = time.Now().In(util.CstSh).UnixMilli()

	}
	queueTable.State = true

	queueTable.lock.Unlock()
}

//通过id查找一条数据，返回一条数据的指针
func (queueTable *QueueTable) Find(id string) *QueueTableField {
	for i := 0; i < len(queueTable.list); i++ {
		if id == queueTable.list[i].Id {
			return &queueTable.list[i]
		}
	}
	return &QueueTableField{}
}

func (queueTable *QueueTable) FindList() []QueueTableField {

	return queueTable.list
}
