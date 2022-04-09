const $ = document.querySelector.bind(document)
const selector = '.player-video video' //video元素类名
const obj = $(selector)

const vplayer = {

    events: 1,


    render: {
        basic: {
            time: () => {
                const exp = vplayer.common()
                exp.nl = exp.nr
                exp.tl = exp.tr
            },
            title: () => {
                const exp = vplayer.common()
                exp.ttl = exp.ttr
            }
        },
        playlist: class {
            constructor() {

            }

            ajax(type, url, callback) {
                let xhr = new XMLHttpRequest()
                xhr.addEventListener('load', function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        let data = JSON.parse(xhr.responseText)
                        callback.call(data.video)
                    }
                })
                xhr.open(type, url)
                xhr.send()
            }
        },
        toolbar: class {
            constructor() {
                this.cf_container = '.video-progress-detail-img'
                this.cf_imgClassName = 'detail-img-capture'
            }

        },
        progressbar: class {
            constructor() {
            }

            rtu() {
                setTimeout(function () {
                    now.innerHTML = parseTime(vp.currentTime)
                    let normalLength = vp.currentTime / vp.duration
                    normal.style.transform = 'scaleX(' + normalLength + ')'
                }, 1000)
            }
        }
    },
    methods: {
        play() {
            let state = () => {
                return obj.paused
            }
            if (state) {
                obj.play()
                console.log('播放开始')
            } else {
                obj.pause()
                console.log('播放暂停')
            }
        },
        capture() {
            const canvas = document.createElement('canvas')
            canvas.getContext('2d').drawImage(obj, 0, 0, obj.videoWidth, obj.videoHeight)
            let img = new Image()
            img.src = canvas.toDataURL("image/png")
            img.className = this.cf_imgClassName
            const view = $(this.cf_container)
            view.replaceChild(img, view.childNodes[0])
            URL.revokeObjectURL(obj.src)
        },
        parseTime(t) {
            let m, s
            m = Math.floor(t / 60)
            s = Math.floor(t % 60)
            m += ''
            s += ''
            m = (m.length === 1) ? '0' + m : m
            s = (s.length === 1) ? '0' + s : s
            return m + ':' + s
        },
        displayList(btn, list, a1, a2) {
            btn.addEventListener('mouseover', function () {
                this.classList.add(a1)
            }, true)
            btn.addEventListener('mouseleave', function () {
                this.classList.remove(a1)
            }, false)
            list.addEventListener('mouseover', function () {
                this.classList.add(a2)
            }, true)
            list.addEventListener('mouseleave', function () {
                this.classList.remove(a2)
            }, false)
        },
        bubbleList(ul, btn, list) {
            let vbs = $('.video-btn-speed')
            let vbss = $('.video-btn-speed-self')
            ul.addEventListener('click', function (e) {
                let target = e.target
                if (target.tagName.toLowerCase() === "li") {
                    let li = this.querySelectorAll(".video-btn-speed-list-item")
                    let len = li.length;
                    for (let i = 0; i < len; i++) {
                        li[i].classList.remove('player-active')
                    }
                    Array.prototype.indexOf.call(li, target)
                    vp.playbackRate = target.getAttribute('data-value')
                    target.classList.add('player-active')
                    vbs.classList.remove('player-speed-show')
                    vbss.innerHTML = target.innerHTML
                }
            })
        },
        switchPlayback() {
            let next = $('.video-btn-next button')
            next.onclick = function () {
                let id = vp.getAttribute('data-id')
                id < data.length - 1 ? id++ : id = 0
                vp.src = data[id].url
                vp.oncanplay = vp.play()
                console.log('当前播放' + id)
                vp.setAttribute('data-id', id)
            }
        },
        handleBars() {
            const pw = document.querySelector('.player-wrap')
            const pl = document.querySelector('.player-layer')
            const vcm = document.querySelector('.player-video-control-mask')
            const vcw = document.querySelector('.player-video-control-wrap')
            const pvp = document.querySelector('.video-progress-slider')
            const start = document.querySelector('.video-btn-start button')
            start.addEventListener('click', function () {
                let instance = new player
                instance.play()
            })
            vp.addEventListener('click', function () {
                let instance = new player
                instance.play()
            })
            let timer = null, isMove = false
            vp.addEventListener("mousemove", function () {
                isMove = true
                clearTimeout(timer)
                console.log('已清除计时器')
                if (isMove) {
                    vp.style.cursor = ''
                    pl.classList.add('video-control-show')
                }
                timer = setTimeout(function () {
                    isMove = false
                    vp.style.cursor = 'none'
                    pl.classList.remove('video-control-show')
                    console.log('已设置计时器')
                }, 500)
            })
            vp.addEventListener("mouseleave", function () {
                pl.classList.remove('video-control-show')
                vp.style.cursor = ''
            })
            vcw.addEventListener("mouseover", function () {
                pl.classList.add('video-control-show')
            }, true)
            vcw.addEventListener("mouseleave", function () {
                pl.classList.remove('video-control-show')
            })
            /* 进度条拖动条件功能
            pvp.addEventListener("mousedown", function (e) {
                let left = e.clientX - this.offsetLeft
                let normal = document.querySelector('.bui-bar-normal')
                console.log('落点位置：'+e.clientX+'\n左侧：'+this.offsetLeft)
                normal.style.transform = 'scaleX(' + e.clientX / 776 + ')'
                document.addEventListener("mousemove", function (e) {
                    let px = e.clientX - left
                    if(px <= 0){
                        px = 0;
                    }
                    else if(px >= 776){
                        px = 776;
                    }
                    normal.style.transform = 'scaleX(' + px / 776 + ')'
                })
                document.addEventListener("mouseup", function (e) {
                    document.onmousemove = null
                    document.onmouseup = null
                })
                return false
            })
            */
            pvp.addEventListener("mouseover", function (e) {
                console.log('当前位置：' + e.offsetX + '\n总长：' + this.clientWidth)
                captureFrame()
            })
            pvp.addEventListener("click", function (e) {
                console.log('当前位置：' + e.offsetX + '\n总长：' + this.clientWidth)
                vp.currentTime = (e.offsetX / this.clientWidth) * vp.duration
                vp.play()
            })
        },
        moveNode(on, nn) {
            for (let i = 0; i < on.childElementCount; i++) {
                nn.appendChild(on.children[i])
            }
        },
        setTime() {
            let t = document.querySelector('.video-time')
            let vts = document.querySelector('.video-time-seek')
            let vtw = document.querySelector('.video-time-wrap')
            t.addEventListener("click", function () {
                vtw.style.display = 'none'
                vts.style.display = 'inline-block'
                vts.focus()
            })
            vts.addEventListener("focus", function () {
                vts.value = parseTime(vp.currentTime)
            })
            vts.addEventListener("change", function () {
                console.log(this.value)
                vp.currentTime = this.value
                vp.play()
                vts.style.display = 'none'
                vtw.style.display = 'block'
                document.querySelectorAll('.video-state-pause span')[0].style.display = 'none'
                document.querySelectorAll('.video-state-pause span')[1].style.display = ''
            })
        }
    },
    common: () => {
        class className {
            now = '.video-time-now'
            currentTime = obj.currentTime
            total = '.video-time-total'
            duration = obj.duration
            title = '.video-top-title'
            data_id = 'data-id'
        }

        class expressionName extends className {
            nl = $(this.now).innerHTML
            nr = vplayer.methods.parseTime(this.currentTime)
            tl = $(this.total).innerHTML
            tr = vplayer.methods.parseTime(this.duration)
            ttl = $(this.title).innerHTML
            ttr = 'hello'//data[obj.getAttribute(this.data_id)].name
        }

        return new expressionName
    }
}
vplayer.init = () => {
    obj.addEventListener('loadedmetadata', () => {
        vplayer.render.basic.time()
        vplayer.render.basic.title()
        console.log('元数据加载完成，时间及标题已完成渲染')
    })
    obj.addEventListener('loadeddata', () => {

    })
    this.methods.setTime()
}
vplayer.events = () => {
    class className {
        buffer = '.bui-bar-buffer'
        normal = '.bui-bar-normal'
    }

    class expressionName extends className {
        buf = $(this.buffer)
        nor = $(this.normal)
    }

    const exp = new expressionName()
    console.log()
    obj.addEventListener("timeupdate", () => {
        // 进度变化时自动更新显示播放时间，设定200毫秒延时降低性能消耗
        setTimeout(() => {
            vplayer.render.basic.time()
            // normal.style.transform = 'scaleX(' + normalLength + ')'
        }, 1000)
    })
    vp.addEventListener('progress', function () {
        let duration = vp.duration // 视频总长度
        if (duration > 0) {
            for (let i = 0; i < vp.buffered.length; i++) {
                // 寻找当前时间之后最近的点
                if (vp.buffered.start(vp.buffered.length - 1 - i) < vp.currentTime) {
                    let bufferedLength = (vp.buffered.end(vp.buffered.length - 1 - i) / duration)
                    console.log(bufferedLength)
                    buffer.style.transform = 'scaleX(' + bufferedLength + ')'
                    break;
                }
            }
        }
    })
    vp.addEventListener("waiting", () => {
        now.innerHTML = '加载中...'
        console.log('正在缓冲')
    })
    vp.addEventListener("play", function () {
        /* 播放时切替暂停图标 */
        document.querySelectorAll('.video-state-pause span')[0].style.display = 'none'
        document.querySelectorAll('.video-state-pause span')[1].style.display = ''
    })
    vp.addEventListener("pause", function () {
        /* 暂停时切替播放图标 */
        document.querySelectorAll('.video-state-pause span')[1].style.display = 'none'
        document.querySelectorAll('.video-state-pause span')[0].style.display = ''
    })
    vp.addEventListener("ended", function (e) {
        /* 播放时切替暂停图标 */
        document.querySelectorAll('.video-state-pause span')[1].style.display = 'none'
        document.querySelectorAll('.video-state-pause span')[0].style.display = ''
        /* 定义播放结束后的行为 *****
        if(data[i+1]){
            console.log('5秒后自动播放下一个视频')
            setTimeout(next(),5000)
        } else {
            console.log('当前唯一视频，展示视频推荐')
        }
        */
    })
    document.addEventListener('click', () => {
        console.log(exp.buf + ',' + exp.nor)
    })
}
vplayer.options = () => {

}
vplayer.source = {
    data: {
        get: () => {
            let data
            let ajax = this.render.playlist.prototype.ajax
            ajax('get', './v_data.json', () => {
                data = this
            })
        }
    }
}

export {vplayer}