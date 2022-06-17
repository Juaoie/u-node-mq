<template>
    <div class="chat-window df ffcn">
        <div class="chat-user-name-title df aic jcsb">
            <span>{{userName}}</span>
        </div>
        <div class="vuescroll-view fg1">
            <vuescroll
                :ops="ops"
                class="vuescroll"
                ref="vs"
                @handle-scroll-complete="handleComplete"
            >
                <div v-for="(item,index) in chatList" :key="item.chatId">
                    <!-- 时间框 -->
                    <div v-if="isTime(item,index)" class="df aic jcc p20">
                        <span v-text="item.chatFormatTime" class="tag-time"></span>
                    </div>
                    <!-- 普通消息 -->
                    <div
                        class="df ptb8 plr25"
                        :class="item.senderId ==userInfo.userId?'ffrrn':'jcfs'"
                        :id="'id'+item.chatId"
                        v-if="item.chatType === '1'"
                    >
                        <el-avatar
                            class="user-head-img"
                            shape="square"
                            size="medium"
                            :src="item.senderId ==userInfo.userId?userInfo.userHeadUrl:userHeadUrl"
                        ></el-avatar>
                        <div
                            v-text="item.message"
                            class="message"
                            :class="item.senderId ==userInfo.userId&&'message-sender'"
                        ></div>
                    </div>
                    <!-- 文件消息 -->
                    <div
                        class="df ptb8 plr25"
                        :class="item.senderId ==userInfo.userId?'ffrrn':'jcfs'"
                        :id="'id'+item.chatId"
                        v-else-if="item.chatType === '3'"
                    >
                        <el-avatar
                            class="user-head-img"
                            shape="square"
                            size="medium"
                            :src="item.senderId ==userInfo.userId?userInfo.userHeadUrl:userHeadUrl"
                        ></el-avatar>
                        <div class="file-message df aic jcsb">
                            <div class="df ffcn jcsb fg1 fp heightfull">
                                <div v-text="item.message" class="fp"></div>
                                <!-- @click="downloadChatFile(item.chatId)" -->
                                <a
                                    class="download-file df aic jcc"
                                    :href="PROJECT_URL+'/user/file/downloadChatFile?chatId='+item.chatId"
                                >下载</a>
                            </div>
                            <img src="@/assets/image/file.png" />
                        </div>
                    </div>
                </div>
            </vuescroll>
        </div>
        <div class="progress df aic" v-show="percentage">
            <el-progress
                class="fg1"
                :percentage="percentage"
                :stroke-width="2"
                :show-text="false"
                color="#409eff"
            ></el-progress>
            <span class="fp">{{fileName}}</span>
        </div>
        <div class="textarea-view df ffcn" :class="focus&&'focus'">
            <div class="chat-utils df aic">
                <div>
                    <el-popover placement="top-start" v-model="showEmojiView">
                        <div class="emoji-view">
                            <vuescroll>
                                <div class="df ffrw base-emoji">
                                    <span
                                        class="df aic jcc"
                                        v-for="(item,index) in emojiList"
                                        :key="index"
                                        @click="chooseExpression(item)"
                                    >{{item}}</span>
                                </div>
                            </vuescroll>
                        </div>
                        <el-tooltip
                            popper-class="tooltip"
                            effect="light"
                            content="表情"
                            placement="bottom-start"
                            :open-delay="500"
                            :visible-arrow="false"
                            :enterable="false"
                            slot="reference"
                        >
                            <img src="@/assets/image/expression.png" />
                        </el-tooltip>
                    </el-popover>
                </div>

                <div>
                    <el-tooltip
                        popper-class="tooltip"
                        effect="light"
                        content="发送文件"
                        placement="bottom-start"
                        :open-delay="500"
                        :visible-arrow="false"
                        :enterable="false"
                    >
                        <upload
                            class="upload-faile"
                            :recipientId="recipientId"
                            :single="true"
                            @loadBack="loadBack"
                            @startUploadFile="startUploadFile"
                            @successBack="successBack"
                            @failBack="failBack"
                        >
                            <img src="@/assets/image/folder.png" />
                        </upload>
                    </el-tooltip>
                </div>

                <div>
                    <el-tooltip
                        popper-class="tooltip"
                        effect="light"
                        content="聊天记录"
                        placement="bottom-start"
                        :open-delay="500"
                        :enterable="false"
                        :visible-arrow="false"
                    >
                        <img src="@/assets/image/chat.png" />
                    </el-tooltip>
                </div>

                <div>
                    <el-tooltip
                        popper-class="tooltip"
                        effect="light"
                        content="催促上线"
                        placement="bottom-start"
                        :open-delay="500"
                        :enterable="false"
                        :visible-arrow="false"
                    >
                        <img src="@/assets/image/collection.png" @click="collection" />
                    </el-tooltip>
                </div>
            </div>
            <el-input
                ref="input"
                v-model="message"
                class="textarea fg1"
                :maxlength="2048"
                type="textarea"
                resize="none"
                @blur="blur"
                @focus="focus=true"
                :class="focus&&'focus'"
                @keydown.native.enter="sendChat"
            ></el-input>
            <div class="df aic jcfe ptb10 pr20">
                <el-button style="background:#f5f5f5;" size="mini" @click="sendChat">发送(Enter)</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import upload from "@/components/upload";
import vuescroll from "vuescroll";
import { PROJECT_URL } from "@/utils/path";
import { Progress, Button, Popover } from "element-ui";
import emojiList from "@/utils/emojiList";
import { log } from "util";
export default {
    components: {
        vuescroll,
        upload,
        "el-progress": Progress,
        "el-button": Button,
        "el-popover": Popover,
    },
    data() {
        return {
            showEmojiView: false, //是否显示表情框
            emojiList, //表情路径
            PROJECT_URL, //项目路径
            percentage: 0, //上传进度条
            fileName: "", //上传中的文字
            userInfo: {}, //用户信息
            chatList: [], //聊天列表
            focus: false, //默认有焦点
            focusIndex: 0, //焦点位置
            message: "", //聊天的数据内容
            userName: "", //接收人名称
            userHeadUrl: "", //接收人的头像
            recipientId: "", //接收人id
            pageNum: 1, //当前页数呀
            ops: {
                //基本配置
                vuescroll: {
                    mode: "native", //模式默认为native，native表示用鼠标滚动轮滚动，slide表示用滚动条滚动
                    sizeStrategy: "number", //
                    detectResize: false, //是否监听内容尺寸变化
                    wheelScrollDuration: 500, //滚动一段距离需要花费的时间
                },
                //使内容滚动配置
                scrollPanel: {
                    scrollingX: false, //是否开启左右滚动
                    easing: "easeOutQuad", //滚动动画
                },
                //滚动条移动所在位置配置
                rail: {},
                //滚动条配置
                bar: {
                    size: "5px", //滚动条宽度
                    background: "#c9c7c6", //滚动条的的颜色
                },
                scrollButton: {},
            },
        };
    },
    props: {
        id: Number,
    },
    async created() {
        let user = sessionStorage.getItem("userInfo");
        if (!user) return;
        this.userInfo = JSON.parse(user);
    },
    async mounted() {
        this.$root.$on("subscribeCallBack", (res) => {
            if (res.body != this.recipientId) return;
            this.subscribeCallBack(res);
        });

        let userInfo = await this.$get("/user/user/getUserInfoByUserId", {
            params: { userId: this.id },
        });
        this.recipientId = this.id;
        this.userHeadUrl = userInfo.userHeadUrl;
        this.userName = userInfo.userName;
        this.chatList = await this.getChatList(this.recipientId, 1);
        this.scrollIntoViewStart();
    },

    methods: {
        /**
         * 点击选择表情触发
         */
        chooseExpression(emoji) {
            let soure = this.message;
            this.message =
                soure.slice(0, this.focusIndex) +
                emoji +
                soure.slice(this.focusIndex);
            this.showEmojiView = false;
            this.$refs.input.focus();
        },
        /**
         * 失去焦点触发
         */
        blur(e) {
            this.focus = false;
            var input = this.$refs.input.$refs.textarea;
            if (input.selectionStart) {
                //非IE
                this.focusIndex = input.selectionStart;
            } else {
                //IE
                try {
                    var range = document.selection.createRange();
                    range.moveStart("character", -input.value.length);
                    this.focusIndex = range.text.length;
                } catch (e) {
                    this.focusIndex = 0;
                }
            }
        },
        /**
         * 点击下载聊天文件
         */
        async downloadChatFile(chatId) {
            await this.$get("/user/file/downloadChatFile", {
                params: { chatId },
            });
        },
        /**
         * 文件上传失败
         */
        failBack(err) {
            this.percentage = 0;
            this.fileName = "";
            this.$message({
                message: "文件发送失败！",
                type: "fail",
            });
        },
        /**
         * 上传文件成功返回
         */
        successBack() {
            this.percentage = 0;
            this.fileName = "";
        },
        /**
         * 开始上传文件触发
         */
        startUploadFile(res) {
            this.fileName = res.name;
        },
        /**
         * 上传文件的加载过程
         */
        loadBack(res) {
            this.percentage = (res.loaded / res.total) * 100;
        },
        /**
         * 催促上线触发
         */
        async collection() {
            try {
                await this.$confirm(
                    "确认发送一条催促上线通知的邮件到对方邮箱？",
                    "提示",
                    {
                        type: "warning",
                    }
                );
            } catch (e) {
                return e;
            }
            await this.$put("/user/user/putCollection", {
                recipientId: this.recipientId,
            });
            this.$message({
                message: "邮件发送成功，对方正在赶来的路上，休息片刻吧！",
                type: "success",
            });
        },
        /***
         * 判断聊天记录这一行是否是时间
         */
        isTime(item, index) {
            if (index === 0) return true;
            if (
                +new Date(item.createTime) -
                    +new Date(this.chatList[index - 1].createTime) >
                2 * 60 * 1000
            ) {
                return true;
            }
        },
        /**
         * 内容滚动结束触发
         */
        async handleComplete(vertical, horizontal) {
            if (vertical.scrollTop == 0) {
                this.pageNum += 1;
                let chatList = await this.getChatList(
                    this.recipientId,
                    this.pageNum
                );
                let chatId = this.chatList[0].chatId;
                this.chatList.unshift(...chatList);
                this.scrollIntoView(chatId);
            }
        },
        /**
         * 发送消息
         */
        async sendChat(e) {
            if (e.shiftKey) return;
            if (this.message.replace(/\n/g, "") === "") {
                this.message = "";
                this.$message("不能发送空白信息");
                return;
            }
            await this.$post("/chat/singleChat/sendChat", {
                recipientId: this.recipientId,
                message: this.message,
            });
            this.message = "";
            this.chatList = await this.getChatList(this.recipientId, 1);
            this.scrollIntoViewStart();
        },
        /**
         * 滚动到指定位置
         */
        async scrollIntoView(chatId) {
            await this.$nextTick();
            this.$refs["vs"].scrollIntoView("#id" + chatId, 0);
        },
        /**
         * 滚动到初始位置
         */
        async scrollIntoViewStart() {
            if (this.chatList.length)
                this.scrollIntoView(
                    this.chatList[this.chatList.length - 1].chatId
                );
        },
        /**
         * 接受到新消息的回调函数
         */
        async subscribeCallBack(res) {
            this.chatList = await this.getChatList(this.recipientId, 1);
            this.scrollIntoViewStart();
        },
        /**
         * 获取消息列表
         */
        async getChatList(recipientId, pageNum) {
            return await this.$get("/chat/singleChat/getUserChatList", {
                params: {
                    recipientId,
                    pageNum,
                },
            });
        },
    },
};
</script>

<style>
.emoji-view {
    width: 400px;
    height: 230px;
    padding: 5px;
}

.base-emoji > span {
    width: 30px;
    height: 30px;
    font-size: 20px;
    cursor: pointer;
    user-select: none;
}
.base-emoji > span:hover {
    background: #dbd9d8;
}
.download-file {
    width: 60px;
    padding: 2px;
    background: #a135ef;
    color: #fff;
    border-radius: 4px;
    user-select: none;
    cursor: pointer;
}
.file-message {
    background: #fff;
    margin: 0 10px;
    height: 88px;
    width: 200px;
    padding: 10px;
    font-size: 14px;
    border-radius: 4px;
}
.file-message img {
    width: 40px;
    height: 40px;
}

.progress {
    background: #f5f5f5;
    padding: 0 20px;
}
.progress > span {
    max-width: 10em;
    margin-left: 10px;
    font-size: 11px;
}
.tooltip {
    padding: 3px !important;
    border-radius: 0 !important;
    box-shadow: 5px 5px 5px #888888;
}
</style>
<style scoped>
.tag-time {
    background: #dadada;
    font-size: 10px;
    color: #fff;
    padding: 4px 6px;
    border-radius: 2px;
}
.message {
    background: #fff;
    margin: 0 10px;
    min-height: 36px;
    max-width: 60%;
    padding: 10px;
    font-size: 14px;
    border-radius: 4px;
    word-break: break-word;
    background: #fff;
    white-space: pre-line;
}
.message-sender {
    background: #9eea6a;
}

.chat-utils {
    padding: 10px 10px 5px 10px;
}
.chat-utils > div {
    width: 20px;
    height: 20px;
    cursor: pointer;
    margin-left: 10px;
}
.chat-utils img {
    width: 100%;
    height: 100%;
}
.chat-utils img:hover {
    filter: contrast(50%);
}
.upload-faile >>> div {
    border: 0;
    border-radius: 0;
    background: rgba(0, 0, 0, 0);
    width: 100%;
    height: 100%;
}
.textarea-view {
    width: 100%;
    height: 200px;
    margin: 0;
    border-top: 1px #e7e7e7 solid;
    background: #f5f5f5;
}
.textarea {
    width: 100%;
}
.textarea >>> textarea {
    border: 0;
    height: 100%;
    padding: 0 20px;
    background: #f5f5f5;
}
.focus,
.focus >>> textarea {
    background: #fff;
}

.vuescroll-view {
    width: 100%;
    background: #f5f5f5;
}

.vuescroll {
    width: 100% !important;
}
.chat-window {
    width: 100%;
    height: 100%;
}
.chat-user-name-title {
    width: 100%;
    height: 70px;
    background: #f5f5f5;
    padding: 30px 20px 0 20px;
    font-size: 18px;
    border-bottom: 1px #e7e7e7 solid;
}
.chat-user-name-title img {
    cursor: pointer;
    width: 40px;
    height: 40px;
    box-shadow: 2px 2px 5px #333333;
}
.chat-user-name-title img:hover {
    filter: contrast(50%);
}
</style>