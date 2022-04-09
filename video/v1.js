const $ = document.querySelector.bind(document)
const selector = '.player-video video' //video元素类名
const obj = $(selector)
const vplayer = {
    //播放器主体初始化
    init: () => {
        obj.addEventListener('loadedmetadata', () => {
            console.log('元数据加载完成，时间及标题已完成渲染')
        })
        obj.addEventListener('loadeddata', () => {
            console.log('视频缓冲开始')
        })
    },
    //播放器外观渲染
    render: () => {
        console.log('时间渲染完成')
        console.log('视频标题渲染完成')
        vplayer.modules.render([progressbar, danmaku, subtitle, resolution, playlist, speed, volume])

    },
    //播放器生命周期（初始化后所有事件进程）
    events: () => {
        vplayer.render()
    },
    //播放器公用方法
    methods: {},
    //播放器公用字符串
    strings: {},
    //播放器附属功能模块
    modules: {
        render: args => {
            for (let i = 0; i < args.length; i++) {
                console.log(args)
                vplayer.modules.args[i].render()
            }
        },
        toolbar: {
            render: () => {
                console.log('工具栏渲染完成')
            },
            events: () => {
            },
            methods: {},
        },
        progressbar: {
            render: () => {
                console.log('进度条渲染完成')
            },
            events: () => {
            },
            methods: {},
        },
        danmaku: {
            render: () => {
                console.log('弹幕渲染完成')
            },
            events: () => {
            },
            methods: {},
        },
        subtitle: {
            render: () => {
                console.log('字幕渲染完成')
            },
            events: () => {
            },
            methods: {},
        },
        resolution: {
            render: () => {
                console.log('分辨率渲染完成')
            },
            events: () => {
            },
            methods: {},
        },
        playlist: {
            render: () => {
                console.log('播放列表渲染完成')
            },
            events: () => {
            },
            methods: {},
        },
        speed: {
            render: () => {
                console.log('倍速渲染完成')
            },
            events: () => {
            },
            methods: {},
        },
        volume: {
            render: () => {
                console.log('音量渲染完成')
            },
            events: () => {
            },
            methods: {},
        },
        //...
    },
}

export {vplayer}