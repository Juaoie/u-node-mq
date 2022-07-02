package view

import (
	ui "github.com/gizak/termui/v3"
)

//渲染头部
func renderHeaderTable() {
	w, _ := ui.TerminalDimensions()
	//头部提示

	header.Text = `q:退出 <-:tabs左移 ->:tabs又移动 c:清空 ctrl+c:清空所有`
	header.SetRect(0, 0, w, 1)
	header.Border = false
	header.TextStyle.Bg = ui.ColorBlue

	ui.Render(header)
}