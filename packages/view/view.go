package view

import (
	"log"
	"time"
	"u-node-mq/packages/data"

	ui "github.com/gizak/termui/v3"
	"github.com/gizak/termui/v3/widgets"
)

var (
	//头部提示
	header = widgets.NewParagraph()
	//tabs切换
	tabs = widgets.NewTabPane("Queue", "Exchange", "News", "Consumer")
	//队列表格
	queueTable = widgets.NewTable()
	//交换机表格
	exchangeTable = widgets.NewTable()
)

func Init() {
	if err := ui.Init(); err != nil {
		log.Fatalf("failed to initialize termui: %v", err)
	}
	//延迟执行语句，会在函数退出时候执行
	defer ui.Close()

	//循环更新
	UpdateHead()
	go Repaint()
	uiEvents := ui.PollEvents()
	for {
		e := <-uiEvents
		switch e.ID {
		case "q":
			return
		case "<Right>":
			tabs.FocusRight()
			UpdateView()
		case "<Left>":
			tabs.FocusLeft()
			UpdateView()
		case "c":
			DelComponentView()
			UpdateView()
		case "<C-c>":
			DelCompoentsView()
			UpdateView()
		}

	}
}

//更新头部样式
func UpdateHead() {
	renderHeaderTable()
	renderTabsTable()
}

//重绘，数据更新就美隔一秒同步数据
func Repaint() {
	w, h := ui.TerminalDimensions()
	for {
		time.Sleep(1 * time.Second)
		nw, nh := ui.TerminalDimensions()
		if w != nw || h != nh || data.Q.State || data.E.State {
			data.Q.State = false
			data.E.State = false
			w = nw
			h = nh
			UpdateView()
		}

	}
}

//清空 组件视图方法
func DelComponentView() {
	switch tabs.ActiveTabIndex {
	case 0:
		data.Q.DelQueueLogList()
	case 1:
		data.E.DelExchangeLogList()
	}
}

//清空所有组件数据
func DelCompoentsView() {
	data.Q.DelQueueLogList()
	data.E.DelExchangeLogList()

}

//tabs切换方法
func UpdateView() {
	ui.Clear()
	UpdateHead()
	switch tabs.ActiveTabIndex {
	case 0:
		renderQueueTable()
	case 1:
		renderExchangeTable()
	}

}
