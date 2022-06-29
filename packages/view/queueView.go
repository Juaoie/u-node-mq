package view

import (
	"strconv"
	"u-node-mq/packages/data"

	ui "github.com/gizak/termui/v3"
)

//渲染队列表格
func renderQueueTable() {
	//队列表格
	list := data.Q.GetQueueLogList()

	arr := [][]string{
		{"ID", "name", "created time", "accepted", "send"},
	}

	for _, v := range list {
		arr = append(arr, []string{v.Id, v.Name, v.CreatedTime, strconv.Itoa(v.Accepted), strconv.Itoa(v.Send)})
	}

	w, h := ui.TerminalDimensions()
	queueTable.Border = false
	queueTable.ColumnWidths = []int{20, 20, 20, 20, w - 80}
	queueTable.Rows = arr

	queueTable.TextStyle = ui.NewStyle(ui.ColorWhite)

	queueTable.SetRect(0, 2, w, h)
	ui.Render(queueTable)
}
