package view

import (
	ui "github.com/gizak/termui/v3"
)

//渲染tabs表格
func renderTabsTable() {
	w, _ := ui.TerminalDimensions()
	//tabs切换
	tabs.Border = false
	tabs.SetRect(0, 1, w, 2)
	ui.Render(tabs)
}
