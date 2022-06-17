<template>
    <label>
        <slot></slot>
        <input class="upload-input" type="file" name="faile" @change="choiceFile" />
    </label>
</template>

<script>
export default {
    props: {
        recipientId: [String, Number],
        single: Boolean,
    },
    data() {
        return {
            onSend: false, //是否在发送文件中
        };
    },
    mounted() {},
    methods: {
        choiceFile(e) {
            if (this.single && this.onSend)
                this.$message({
                    message: "还有文件未发送完成！",
                    type: "fail",
                });
            else this.uploadFile(e);
        },
        async uploadFile(e) {
            this.onSend = true;
            try {
                const file = new FormData();
                file.append("file", e.target.files[0]);
                this.$emit("startUploadFile", e.target.files[0]);
                const data = await this.$post("/user/file/uploadFile", file, {
                    headers: { "content-type": "multipart/form-data" },
                    params: { recipientId: this.recipientId },
                    onUploadProgress: (progressEvent) => {
                        this.$emit("loadBack", progressEvent);
                    },
                });
                this.$emit("successBack", data);
            } catch (error) {
                this.$emit("failBack", error);
            } finally {
                this.onSend = false;
            }
        },
    },
};
</script>

<style scoped>
.upload-input {
    display: none;
}
</style>