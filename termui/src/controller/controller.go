package controller

import (
	"io"
	"net/http"
	"os"
	"u-node-mq-termui/src/data"

	"github.com/gin-gonic/gin"
)

func SetQueueData() {
	// 记录到文件。
	f, _ := os.Create("gin.log")
	gin.DefaultWriter = io.MultiWriter(f)

	r := gin.Default()
	r.POST("/queue", queue)
	r.POST("/exchange", exchange)
	r.POST("/news", news)
	r.POST("/consumer", consumer)
	r.Run(":9090")

}

func queue(c *gin.Context) {
	q := data.QueueLogData{}
	c.BindJSON(&q)
	if q.Id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "fail"})
	} else {
		data.Q.Set(q)
		c.JSON(http.StatusOK, gin.H{"message": "ok!", "code": 200})
	}
}

func exchange(c *gin.Context) {
	e := data.ExchangeLogData{}
	c.BindJSON(&e)
	if e.Id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "fail"})
	} else {
		data.E.Set(e)
		c.JSON(http.StatusOK, gin.H{"message": "ok!", "code": 200})
	}
}

func news(c *gin.Context) {
	n := data.NewsLogData{}
	c.BindJSON(&n)
	if n.Id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "fail"})
	} else {
		data.N.Set(n)
		c.JSON(http.StatusOK, gin.H{"message": "ok!", "code": 200})
	}
}

func consumer(c *gin.Context) {
	cc := data.ConsumerLogData{}
	c.BindJSON(&cc)
	if cc.Id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "fail"})
	} else {
		data.C.Set(cc)
		c.JSON(http.StatusOK, gin.H{"message": "ok!", "code": 200})
	}
}
