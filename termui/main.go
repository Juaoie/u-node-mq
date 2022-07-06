package main

import (
	"u-node-mq-termui/src/controller"
	"u-node-mq-termui/src/view"
)

func main() {
	go controller.SetQueueData()
	view.Init()
}
