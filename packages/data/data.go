package data

import (
	"sync"
)

/*
	Queue
*/

type QueueLog struct {
	Name     string `json:"name"`
	Accepted int    `json:"accepted"` //累计接受消息数量
	Send     int    `json:"send"`     //累计发送数量
	NewsNum  int    `json:"newsNum"`  //消息数量
	NewsIds  []int  `json:newsIds`    //消息id列表
	Component
}
type QueueLogList struct {
	lock  sync.RWMutex
	list  []QueueLog
	State bool //是否有新数据更新
}

var (
	Q = QueueLogList{}
)

func (q *QueueLogList) DelQueueLogList() {
	q.lock.Lock()

	q.list = []QueueLog{}
	q.State = true

	q.lock.Unlock()
}

func (q *QueueLogList) AddQueueLog(queueLog QueueLog) {

	queue := findById(Q.list, "123")

	q.lock.Lock()

	Q.list.
		q.list = append(q.list, *queueLog)
	q.State = true

	q.lock.Unlock()

}

func (q *QueueLogList) GetQueueLogList() []QueueLog {
	return q.list
}

/*
	Exchange
*/

type ExchangeLog struct {
	Id          string `json:"id"`
	CreatedTime string `json:"createdTime"`
	Accepted    int    `json:"accepted"` //累计接受消息数量
	Send        int    `json:"send"`     //累计发送数量
	QueueNames  string `json:"queueNames"`
}
type ExchangeLogList struct {
	lock  sync.RWMutex
	list  []ExchangeLog
	State bool
}

var (
	E = &ExchangeLogList{}
)

func (e *ExchangeLogList) DelExchangeLogList() {
	e.lock.Lock()

	e.list = []ExchangeLog{}
	e.State = true

	e.lock.Unlock()
}

func (e *ExchangeLogList) AddExchangeLog(id string, createdTimie string) {
	exchangeLog := &ExchangeLog{}
	exchangeLog.Id = id
	exchangeLog.CreatedTime = createdTimie
	exchangeLog.Accepted = 0
	exchangeLog.Send = 0

	e.lock.Lock()

	e.list = append(e.list, *exchangeLog)
	e.State = true

	e.lock.Unlock()

}

func (e *ExchangeLogList) GetExchangeLogList() []ExchangeLog {
	return e.list
}
