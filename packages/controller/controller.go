package controller

import (
	"io"
	"net/http"
	"os"
	"u-node-mq/packages/data"
	"u-node-mq/packages/view"

	"github.com/gin-gonic/gin"
)

func SetQueueData() {
	// 记录到文件。
	f, _ := os.Create("gin.log")
	gin.DefaultWriter = io.MultiWriter(f)

	r := gin.Default()
	r.POST("/addQueueData", addQueueData)
	r.POST("/addExchangeData", addExchangeData)
	r.Run(":9090")

}

//添加一条queue创建数据
func addQueueData(c *gin.Context) {
	q := &data.QueueLog{}
	c.BindJSON(&q)

	data.Q.AddQueueLog(q.Id, q.Name, q.CreatedTime)
	//拿到数据更新视图
	view.UpdateView()
	c.JSON(http.StatusOK, gin.H{
		"message": "ok!",
	})

}

//添加一条exchange创建数据
func addExchangeData(c *gin.Context) {
	e := &data.ExchangeLog{}
	c.BindJSON(&e)

	data.E.AddExchangeLog(e.Id, e.CreatedTime)
	//拿到数据更新视图
	view.UpdateView()
	c.JSON(http.StatusOK, gin.H{
		"message": "ok!",
	})

}
