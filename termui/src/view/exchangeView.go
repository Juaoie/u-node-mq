package view

import (
	"strconv"
	"time"
	"u-node-mq-termui/src/data"
	"u-node-mq-termui/src/util"

	ui "github.com/gizak/termui/v3"
)

//渲染交换机表格
func renderExchangeTable() {
	list := data.E.FindList()
	arr := [][]string{
		{"ID", "Name", "CreatedTime", "UpdateTime", "AcceptedCount", "SendCount", "QueueNames"},
	}

	for _, v := range list {
		arr = append(arr, []string{
			v.Id,
			v.Name,
			time.UnixMilli(v.CreatedTime).Format(util.FormatStamp),
			time.UnixMilli(v.UpdateTime).Format(util.FormatStamp),
			strconv.Itoa(v.AcceptedCount),
			strconv.Itoa(v.SendCount),
			paseString(v.QueueNames),
		})
	}

	w, h := ui.TerminalDimensions()
	//交换机表格
	exchangeTable.Border = false
	exchangeTable.ColumnWidths = []int{20, 20, 20, 20, 20, 20, w - 120}
	exchangeTable.Rows = arr
	exchangeTable.TextStyle = ui.NewStyle(ui.ColorWhite)

	exchangeTable.SetRect(0, 2, w, h)
	ui.Render(exchangeTable)
}
