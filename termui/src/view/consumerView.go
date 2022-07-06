package view

import (
	"strconv"
	"time"
	"u-node-mq-termui/src/data"
	"u-node-mq-termui/src/util"

	ui "github.com/gizak/termui/v3"
)

//渲染Consumer表格
func renderConsumerTable() {
	list := data.C.FindList()

	arr := [][]string{
		{"ID", "CreatedTime", "UpdateTime", "AcceptedCount"},
	}

	for _, v := range list {
		arr = append(arr, []string{
			v.Id,
			time.UnixMilli(v.CreatedTime).Format(util.FormatStamp),
			time.UnixMilli(v.UpdateTime).Format(util.FormatStamp),
			strconv.Itoa(v.AcceptedCount),
		})
	}

	w, h := ui.TerminalDimensions()
	//交换机表格
	consumerTable.Border = false
	consumerTable.ColumnWidths = []int{20, 20, 20, w - 60}
	consumerTable.Rows = arr
	consumerTable.TextStyle = ui.NewStyle(ui.ColorWhite)

	consumerTable.SetRect(0, 2, w, h)
	ui.Render(consumerTable)
}
