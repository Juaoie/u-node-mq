<template>
    <div class="mail-list-chat df">
        <audio ref="audio" src="@/assets/audio/wx.mp3" id="audio"></audio>
        <div class="mail-list df ffcn aic">
            <div class="tab df jcsb">
                <el-input
                    class="select-chat-info"
                    placeholder="搜索"
                    prefix-icon="el-icon-search"
                    size="mini"
                ></el-input>
                <div class="add-user df aic jcc">+</div>
            </div>
            <div
                class="df aic mail-list-user"
                v-for="item in mailList"
                :key="item.recipientId"
                :class="item.recipientId == choiceChatUser && 'mail-list-user-xuan'"
                @click="clickUser(item)"
            >
                <el-badge
                    :hidden="!item.unreadNum"
                    :value="item.unreadNum"
                    :max="99"
                    size="small"
                    class="user-head-badge"
                >
                    <el-avatar
                        class="user-head-img"
                        shape="square"
                        size="medium"
                        :src="item.userHeadUrl"
                        :alt="item.userName"
                    ></el-avatar>
                </el-badge>

                <!-- <img  :src="item.userHeadUrl" alt /> -->
                <div class="chat-view plr5 df ffcn jcsb">
                    <div class="df aic jcsb">
                        <div class="user-name w18 fp">{{item.userName}}</div>
                        <div class="chat-time w06">{{item.chatFormatTime}}</div>
                    </div>
                    <div class="user-chat fp">{{item.message}}</div>
                </div>
            </div>
        </div>
        <template v-for="item in chatWindowList">
            <chat-window :key="item" v-show="item === choiceChatUser" :id="item"></chat-window>
        </template>
    </div>
</template>

<script>
import chatWindow from "./chatWindow";
export default {
    components: {
        chatWindow,
    },
    data() {
        return {
            mailList: [], //通讯录列表
            userInfo: {}, //用户信息
            unreadChatList: [], //未读消息列表
            choiceChatUser: 0, //默认选择的用户id
            chatWindowList: [], //聊天窗口的列表
        };
    },
    async created() {
        let user = sessionStorage.getItem("userInfo");
        if (!user) return;
        this.userInfo = JSON.parse(user);
        this.mailList = await this.$get("/user/user/getMailListChat");
        //第一个为默认打开的用户
        if (this.mailList.length) {
            this.choiceChatUser = this.mailList[0].recipientId;
            this.chatWindowList.push(this.choiceChatUser);
        }
    },
    async mounted() {
        this.$root.$on("subscribeCallBack", (res) => {
            this.subscribeCallBack(res);
        });
    },
    methods: {
        /**
         * 接受聊天信息的回调函数
         */
        async subscribeCallBack(res) {
            this.mailList = await this.$get("/user/user/getMailListChat");
            //确认消息已经消费了，确认就会断开连接
            //res.ack();
            //判断消息是否发送给自个的
            if (res.body == this.userInfo.userId) return;
            //加入一条未读消息
            this.unreadChatList.push(res.body);
            //过滤掉当前选择的用户未读消息
            this.filterUnreadChat();
            //给未读消息赋值
            this.assignUnreadChat();
            //将消息传给父组件
            this.$emit("unreadChat", this.unreadChatList.length);
            //桌面通知
            this.notification(res.body);
            //先把页面加载完了
            await this.$nextTick();
            //给点声音
            this.$refs.audio.play();
        },
        //发送桌面通知
        notification(userId) {
            if (!document.hidden) return;
            let userInfo = this.mailList.find((item) => {
                return item.recipientId == userId;
            });
            new Notification(`注意`, {
                timestamp: 2000,
                icon: userInfo.userHeadUrl,
                body: `接收到一条来自于${userInfo.userName}的消息!`,
            });
        },
        /**
         * 过滤掉当前选择用户的未读消息
         */
        filterUnreadChat() {
            for (let i = 0; i < this.unreadChatList.length; ) {
                //需要删除的未读消息记录
                if (this.unreadChatList[i] == this.choiceChatUser)
                    this.unreadChatList.splice(i, 1);
                else i++;
            }
        },
        /**
         * 先格式化用户通讯录的消息，再给未读消息赋值
         */
        assignUnreadChat() {
            //格式化默认未读消息
            this.mailList.forEach((item) => {
                item.unreadNum = 0;
            });
            for (let m of this.mailList) {
                for (let j of this.unreadChatList) {
                    if (m.recipientId == j) m.unreadNum++;
                }
            }
        },
        /**
         * 点击选择用户的聊天框
         */
        clickUser(item) {
            this.choiceChatUser = item.recipientId;
            this.filterUnreadChat();
            this.assignUnreadChat();
            this.$emit("unreadChat", this.unreadChatList.length);
            if (this.chatWindowList.includes(this.choiceChatUser)) return;
            this.chatWindowList.push(this.choiceChatUser);
        },
    },
};
</script>

<style scoped>
.mail-list-chat {
    width: 100%;
    height: 100%;
}
.user-name {
    font-size: 14px;
    color: #000;
}
.chat-view {
    height: 40px;
    width: 180px;
}
.chat-time {
    text-align: right;
    font-size: 11px;
    color: #818181;
}
.user-chat {
    width: 100%;
    font-size: 12px;
    color: #818181;
}

.user-head-img {
    width: 40px;
    height: 40px;
    border-radius: 0;
}
.user-head-badge >>> .el-badge__content {
    background: #fa5151;
    border: 0;
}
.mail-list-user {
    user-select: none;
    height: 60px;
    padding: 10px;
    width: 100%;
}
.mail-list-user-xuan {
    background: #c9c7c6 !important;
}
.mail-list-user:hover {
    background: #dbd9d8;
}

.mail-list {
    width: 240px;
    height: 100%;
    background: #eceae8;
}
.tab {
    width: 100%;
    height: 70px;
    padding: 0 10px 0 10px;
}
.select-chat-info {
    width: 180px;
    height: 25px;
    border-radius: 4px;
    margin-top: 30px;
}
.select-chat-info >>> input {
    height: 100%;
    background: #dbd9d8;
}
.select-chat-info >>> .el-input__inner::placeholder {
    color: #818181;
    font-size: 12px;
}

.add-user {
    width: 25px;
    height: 25px;
    background: #dbd9d8;
    border-radius: 4px;
    margin-top: 30px;
}
.add-user:hover {
    background: #c9c7c6;
}
</style>