package main

import (
	"u-node-mq/packages/controller"
	"u-node-mq/packages/view"
)

func main() {
	go controller.SetQueueData()
	view.Init()
}
