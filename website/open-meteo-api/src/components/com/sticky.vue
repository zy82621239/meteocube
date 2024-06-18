<template>
    <div class="sticky-box" :style="style">
        <div :style="style2">
            <slot/>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            style:{},
            style2:{},
            offsetTop:0,
            offsetLeft:0,
            offsetWidth:0,
            offsetHeight:0,
        }
    },
    mounted(){
        this.initRender();
        window.addEventListener('scroll', this.handleScroll);   //  离开页面清除（移除）滚轮滚动事件
    },
    destroyed: function () {
        window.removeEventListener('scroll', this.handleScroll, true);   //  离开页面清除（移除）滚轮滚动事件
    },
    methods:{
        initRender(){
            var $el = this.$el;
            this.style = {
                width : $el.offsetWidth+'px',
                height:$el.offsetHeight+'px'
            };
            this.offsetTop = $el.offsetTop + $el.offsetParent.offsetTop;
            this.offsetLeft = $el.offsetLeft + $el.offsetParent.offsetLeft;
            this.offsetWidth = $el.offsetWidth;
            this.offsetHeight = $el.offsetHeight;
        },
        handleScroll(){
            let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            let offsetLeft = document.documentElement.offsetLeft || document.body.offsetLeft;
            if(scrollTop > this.offsetTop){
                this.style2 = {
                    ...this.style,
                    position : 'fixed',
                    top : Math.max(this.offsetTop - scrollTop , 0),
                    bottom: null,
                    right : null,
                    left: null,
                };
                // console.log("handleScroll" , {clientHeight,scrollTop,offsetLeft} , this.offsetTop , this.offsetLeft , this.offsetWidth ,this.offsetHeight);
            }else{
                this.style2 = {
                    ...this.style,
                    position : 'relative',
                    top : null,
                    bottom: null,
                    right : null,
                    left: null,
                };
            }
        },
    }
}
</script>