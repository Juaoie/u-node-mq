package view

import (
	"strconv"
	"u-node-mq/packages/data"

	ui "github.com/gizak/termui/v3"
)

//渲染交换机表格
func renderExchangeTable() {
	list := data.E.GetExchangeLogList()

	arr := [][]string{
		{"ID", "created time", "accepted", "send", "Queue name of the sent message"},
	}

	for _, v := range list {
		arr = append(arr, []string{v.Id, v.CreatedTime, strconv.Itoa(v.Accepted), strconv.Itoa(v.Send), v.QueueNames})
	}

	w, h := ui.TerminalDimensions()
	//交换机表格
	exchangeTable.Border = false
	exchangeTable.ColumnWidths = []int{20, 20, 20, 20, w - 80}
	exchangeTable.Rows = arr
	exchangeTable.TextStyle = ui.NewStyle(ui.ColorWhite)

	exchangeTable.SetRect(0, 2, w, h)
	ui.Render(exchangeTable)
}
