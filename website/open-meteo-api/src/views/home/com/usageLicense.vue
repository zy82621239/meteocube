<template>
    <com-tabs style="box-shadow:none;border: none;" :tab-list="[
        {label:'Non-Commercial',name:'Non-Commercial'},
        {label:'Commercial',name:'Commercial' , fileds:['apikey']},
        {label:'Self-Hosted',name:'Self-Hosted',fileds:['ServerUrl']}
        ]"  @tab-click="$emit('tabChange', ...arguments)">
        <div slot="header-left" style="font-weight: bold;">
            Usage License:
        </div>
        <template slot-scope="{name}">
            <template v-if="name === 'Non-Commercial'">
                <div class="alert alert-info" role="alert">Only for <strong>non-commercial use</strong> and less than 10.000 daily API calls. See <a href="/en/terms">Terms</a> for more details.</div>
            </template>
            <template v-if="name === 'Commercial'">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="API Key">
                            <el-input v-model="ApiKey" @input="$emit('update:apiKey', ...arguments)"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16" class="auto-wrap">
                        <div class="alert alert-info" role="alert">See <a href="/en/pricing">Pricing</a> for more details.</div>
                    </el-col>
                </el-row>
            </template>
            <template v-if="name === 'Self-Hosted'">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="Server URL">
                            <el-input v-model="ServerUrl" @input="$emit('update:serverUrl', ...arguments)"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16" class="auto-wrap">
                        <div class="alert alert-info" role="alert">See <a href="https://github.com/open-meteo/open-meteo">GitHub</a> for more instructions. Make sure your node supports HTTPS.</div>
                    </el-col>
                </el-row>
            </template>
        </template>
    </com-tabs>
</template>
<script>
export default {
    props:{
        serverUrl:{
            type:String,
            default(){return ''}
        },
        apiKey:{
            type:String,
            default(){return ''}
        },
    },
    data(){
        return {
            ServerUrl:this.serverUrl || '',
            ApiKey:this.apiKey || '',
        };
    },
}
</script>