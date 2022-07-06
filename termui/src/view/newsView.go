package view

import (
	"time"
	"u-node-mq-termui/src/data"
	"u-node-mq-termui/src/util"

	ui "github.com/gizak/termui/v3"
)

//渲染news表格
func renderNewsTable() {
	list := data.N.FindList()

	arr := [][]string{
		{"ID", "CreatedTime", "UpdateTime"},
	}

	for _, v := range list {
		arr = append(arr, []string{
			v.Id,
			time.UnixMilli(v.CreatedTime).Format(util.FormatStamp),
			time.UnixMilli(v.UpdateTime).Format(util.FormatStamp),
		})
	}

	w, h := ui.TerminalDimensions()
	//交换机表格
	newsTable.Border = false
	newsTable.ColumnWidths = []int{20, 20, w - 40}
	newsTable.Rows = arr
	newsTable.TextStyle = ui.NewStyle(ui.ColorWhite)

	newsTable.SetRect(0, 2, w, h)
	ui.Render(newsTable)
}
