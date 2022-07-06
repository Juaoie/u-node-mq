package data

import (
	"sync"
	"time"
	"u-node-mq-termui/src/util"
)

//控制器，前端传递的json
type ExchangeLogData struct {
	BaseLogData
	Message    string   `json:"message"`    //文本说明日志，error 也会使用 message 字段输出
	Accepted   int      `json:"accepted"`   //接收消息的数量，
	Send       int      `json:"send"`       //消息路由到队列的队列数量
	QueueNames []string `json:"queueNames"` //消息路由到队列的队列名称数组
}

//表json
type ExchangeTableField struct {
	TableField
	//下面是统计数据
	AcceptedCount int
	SendCount     int
	QueueNames    []string
}

type ExchangeTable struct {
	lock  sync.Mutex
	list  []ExchangeTableField
	State bool
}

var (
	E = ExchangeTable{}
)

//添加数据
//一个id的组件只会创建一次
func (exchangeTable *ExchangeTable) Add(ExchangeLogData ExchangeLogData) {
	e := ExchangeTableField{}
	e.Id = ExchangeLogData.Id
	e.Name = ExchangeLogData.Name
	e.CreatedTime = ExchangeLogData.CreatedTime
	e.UpdateTime = time.Now().In(util.CstSh).UnixMilli()
	e.AcceptedCount += ExchangeLogData.Accepted
	e.SendCount += ExchangeLogData.Send
	e.QueueNames = ExchangeLogData.QueueNames
	exchangeTable.list = append(exchangeTable.list, e)
	exchangeTable.State = true

}

//删除list
func (exchangeTable *ExchangeTable) DeleAll() {
	exchangeTable.list = []ExchangeTableField{}
	exchangeTable.State = true

}

//设置值，如果id不存在，就添加一条
func (exchangeTable *ExchangeTable) Set(ExchangeLogData ExchangeLogData) {
	e := exchangeTable.Find(ExchangeLogData.Id)
	//是否需要加锁呢？
	exchangeTable.lock.Lock()
	if e.Id == "" {
		exchangeTable.Add(ExchangeLogData)
	} else {
		e.Name = ExchangeLogData.Name
		e.AcceptedCount += ExchangeLogData.Accepted
		e.SendCount += ExchangeLogData.Send
		//驱虫，
		for _, v1 := range ExchangeLogData.QueueNames {
			isRest := false
			for _, v2 := range e.QueueNames {
				if v1 == v2 {
					isRest = true
					break
				}
			}
			if !isRest {
				e.QueueNames = append(e.QueueNames, v1)
			}
		}

		e.UpdateTime = time.Now().In(util.CstSh).UnixMilli()

	}
	exchangeTable.State = true

	exchangeTable.lock.Unlock()
}

//通过id查找一条数据，返回一条数据的指针
func (exchangeTable *ExchangeTable) Find(id string) *ExchangeTableField {
	for i := 0; i < len(exchangeTable.list); i++ {
		if id == exchangeTable.list[i].Id {
			return &exchangeTable.list[i]
		}
	}
	return &ExchangeTableField{}
}

func (exchangeTable *ExchangeTable) FindList() []ExchangeTableField {

	return exchangeTable.list
}
