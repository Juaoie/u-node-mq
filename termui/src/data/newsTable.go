package data

import (
	"sort"
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
func (nt *NewsTable) Add(NewsLogData NewsLogData) {
	n := NewsTableField{}
	n.Id = NewsLogData.Id
	n.CreatedTime = NewsLogData.CreatedTime
	n.UpdateTime = time.Now().In(util.CstSh).UnixMilli()
	nt.list = append(nt.list, n)
	nt.State = true

}

//删除list
func (nt *NewsTable) DeleAll() {
	nt.list = []NewsTableField{}
	nt.State = true

}

//设置值，如果id不存在，就添加一条
func (nt *NewsTable) Set(NewsLogData NewsLogData) {
	n := nt.Find(NewsLogData.Id)
	//是否需要加锁呢？
	nt.lock.Lock()
	if n.Id == "" {
		nt.Add(NewsLogData)
	} else {

		n.UpdateTime = time.Now().In(util.CstSh).UnixMilli()

	}
	nt.State = true

	nt.lock.Unlock()
}

//通过id查找一条数据，返回一条数据的指针
func (nt *NewsTable) Find(id string) *NewsTableField {
	for i := 0; i < len(nt.list); i++ {
		if id == nt.list[i].Id {
			return &nt.list[i]
		}
	}
	return &NewsTableField{}
}

func (nt *NewsTable) FindList() []NewsTableField {
	sort.Slice(nt.list, func(i, j int) bool {
		return nt.list[i].UpdateTime > nt.list[j].UpdateTime
	})

	return nt.list
}
