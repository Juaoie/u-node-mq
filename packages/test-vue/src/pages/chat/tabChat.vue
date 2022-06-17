<template>
    <div class="tab-chat df">
        <div class="tab df ffcn jcsb aic">
            <div class="df ffcn aic">
                <el-badge
                    :hidden="!unreadChatListSize"
                    :value="unreadChatListSize"
                    :max="99"
                    size="small"
                    class="user-head-badge mt25"
                >
                    <el-tooltip
                        popper-class="tooltip"
                        content="修改信息"
                        placement="right-start"
                        :open-delay="500"
                        :visible-arrow="false"
                        :enterable="false"
                    >
                        <img
                            class="tab-head-img"
                            :src="userInfo.userHeadUrl"
                            @click="dialogVisible = true"
                            alt
                        />
                    </el-tooltip>
                </el-badge>
                <el-tooltip
                    popper-class="tooltip"
                    content="消息"
                    placement="right-start"
                    :open-delay="500"
                    :visible-arrow="false"
                    :enterable="false"
                >
                    <img class="mail-list-chat-mr" src="@/assets/image/tab_chat_xuan.png" alt />
                </el-tooltip>
            </div>
            <div class="df ffcn aic">
                <el-tooltip
                    popper-class="tooltip"
                    content="登出"
                    placement="right-start"
                    :open-delay="500"
                    :visible-arrow="false"
                    :enterable="false"
                >
                    <img
                        class="mail-list-chat-mr mb30"
                        @click="userLogOut"
                        src="@/assets/image/user-log-out.png"
                        alt
                    />
                </el-tooltip>
            </div>
        </div>
        <router-view ref="mailListChat" @unreadChat="res=>{unreadChatListSize =res}" />
        <!-- 下面是修改信息弹窗 -->
        <el-dialog title="修改我的信息" :visible.sync="dialogVisible">
            <div>
                <el-row>
                    <el-upload
                        class="avatar-uploader"
                        :action="action"
                        :drag="true"
                        :on-error="fileUploadError"
                        :on-success="fileUploadSuccess"
                    >
                        <img v-if="userHeadUrl" :src="userHeadUrl" class="avatar" />
                        <img v-else :src="userInfo.userHeadUrl" class="avatar" />
                        <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
                    </el-upload>
                </el-row>
                <el-row>
                    <el-input
                        class="input mt20"
                        :maxlength="10"
                        size="large"
                        v-model="userInfo.userName"
                        placeholder="输入我的名称"
                    >
                        <template slot="prepend">
                            <span>我的名字</span>
                        </template>
                    </el-input>
                </el-row>
                <el-row>
                    <el-input
                        class="input mt20"
                        :maxlength="10"
                        size="large"
                        v-model="userInfo.userDescribe"
                        placeholder="输入我的个性签"
                    >
                        <template slot="prepend">
                            <span>个性签</span>
                        </template>
                    </el-input>
                </el-row>
                <el-row class="df aic jcfe">
                    <el-button size="small" type="primary" class="mt20" @click="updateUserInfo">确认修改</el-button>
                </el-row>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { PROJECT_URL, USER_MIN_SERVICE } from "@/utils/path";
export default {
    data() {
        return {
            userHeadUrl: "", //上传准备修改的头像
            dialogVisible: false, //控制修改信息弹窗是否显示
            userInfo: {},
            unreadChatListSize: 0, //未读消息列表
            action: PROJECT_URL + USER_MIN_SERVICE + "/file/postLocalImage", //头像地址
            client: null, //消息实例
        };
    },
    created() {},
    mounted() {
        let userInfoStr = sessionStorage.getItem("userInfo");
        if (userInfoStr) this.userInfo = JSON.parse(userInfoStr);
        else this.$router.replace("/login/loginUser");
        this.$root.$on("subscribeCallBack", (res) => {
            this.subscribeCallBack(res);
        });
    },
    methods: {
        subscribeCallBack(res) {},
        /**
         * 文件上传失败触发
         */
        async fileUploadError() {
            await this.$confirm("图片上传失败！");
        },
        /**
         * 图片上传成功触发
         */
        async fileUploadSuccess(res) {
            this.userHeadUrl = res.data;
            await this.$confirm("上传图片成功！");
        },
        /**
         * 点击修改用户信息触发
         */
        async updateUserInfo() {
            let list = this.userHeadUrl.split("/");
            await this.$put("/user/user/updateUserInfo", {
                userHeadUrl: list[list.length - 1] || null,
                userName: this.userInfo.userName,
                userDescribe: this.userInfo.userDescribe,
            });
            this.userInfo.userHeadUrl = this.userHeadUrl;
            await this.$confirm("信息修改成功！");
            this.dialogVisible = false;
        },
        //点击用户登出触发
        async userLogOut() {
            try {
                await this.$confirm("是否退出登录？", "提示", {
                    type: "warning",
                });
            } catch (e) {
                return e;
            }
            this.client.unsubscribe();
            this.client.disconnect();
            this.$put("/user/user/userLogOut");
            sessionStorage.removeItem("userInfo");
            this.$router.replace("/login/loginUser");
        },
    },
};
</script>

<style scoped>
.avatar-uploader >>> .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader >>> .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader >>> .el-upload-dragger {
    width: 120px;
    height: 120px;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
}
.avatar {
    width: 120px;
    height: 120px;
    display: block;
}
.user-head-badge >>> .el-badge__content {
    background: #fa5151;
    border: 0;
}
.tab-chat {
    width: 100%;
    height: 100%;
}
.tab {
    height: 100%;
    background: #26292b;
    width: 60px;
}
.mail-list-chat-mr {
    width: 30px;
    height: 30px;
    margin-top: 20px;
    cursor: pointer;
}
.tab-head-img {
    width: 35px;
    height: 35px;
}
</style>