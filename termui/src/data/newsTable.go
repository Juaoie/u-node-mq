package data

import (
	"sync"
	"time"
	"u-node-mq-termui/src/util"
)

//前端传递的json
type NewsLogData struct {
	BaseLogData
}

//表json
type NewsTableField struct {
	TableField
}

type NewsTable struct {
	lock  sync.Mutex
	list  []NewsTableField
	State bool
}

var (
	N = NewsTable{}
)

//添加数据
//一个id的组件只会创建一次
func (newsTable *NewsTable) Add(NewsLogData NewsLogData) {
	n := NewsTableField{}
	n.Id = NewsLogData.Id
	n.CreatedTime = NewsLogData.CreatedTime
	n.UpdateTime = time.Now().In(util.CstSh).UnixMilli()
	newsTable.list = append(newsTable.list, n)
	newsTable.State = true

}

//删除list
func (newsTable *NewsTable) DeleAll() {
	newsTable.list = []NewsTableField{}
	newsTable.State = true

}

//设置值，如果id不存在，就添加一条
func (newsTable *NewsTable) Set(NewsLogData NewsLogData) {
	n := newsTable.Find(NewsLogData.Id)
	//是否需要加锁呢？
	newsTable.lock.Lock()
	if n.Id == "" {
		newsTable.Add(NewsLogData)
	} else {

		n.UpdateTime = time.Now().In(util.CstSh).UnixMilli()

	}
	newsTable.State = true

	newsTable.lock.Unlock()
}

//通过id查找一条数据，返回一条数据的指针
func (newsTable *NewsTable) Find(id string) *NewsTableField {
	for i := 0; i < len(newsTable.list); i++ {
		if id == newsTable.list[i].Id {
			return &newsTable.list[i]
		}
	}
	return &NewsTableField{}
}

func (newsTable *NewsTable) FindList() []NewsTableField {

	return newsTable.list
}
