package view

import (
	"strconv"
	"time"
	"u-node-mq-termui/src/data"
	"u-node-mq-termui/src/util"

	ui "github.com/gizak/termui/v3"
)

func paseString(list []string) string {
	s := ""
	for _, v := range list {
		s += v
	}
	return s
}

//渲染队列表格
func renderQueueTable() {
	//队列表格
	list := data.Q.FindList()

	arr := [][]string{
		{"ID", "Name", "CreatedTime", "UpdateTime", "NewsNum", "NewsIds", "ConsumerNum", "ConsumerIds"},
	}

	for _, v := range list {
		arr = append(arr, []string{
			v.Id,
			v.Name,
			time.UnixMilli(v.CreatedTime).Format(util.FormatStamp),
			time.UnixMilli(v.UpdateTime).Format(util.FormatStamp),
			strconv.Itoa(v.NewsNum),
			paseString(v.NewsIds),
			strconv.Itoa(v.ConsumerNum),
			paseString(v.ConsumerIds),
		})
	}

	w, h := ui.TerminalDimensions()
	queueTable.Border = false
	queueTable.ColumnWidths = []int{20, 20, 20, 20, 20, 20, 20, w - 140}
	queueTable.Rows = arr

	queueTable.TextStyle = ui.NewStyle(ui.ColorWhite)

	queueTable.SetRect(0, 2, w, h)
	ui.Render(queueTable)
}
