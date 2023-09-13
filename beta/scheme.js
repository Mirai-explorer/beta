// Scheme 套餐方案过滤器：一套完整的方案筛选机制，包括三个数据筛选流程，最后输出结果
class Scheme {
    constructor(item, input) {
        this.counter = item.total
        this.counting_method = item.counting_method
        this.rtimes = item.remaining
        this.compare = input.compare
        this.confirm_time = input.timestamp
        this.expire_time = item.expire_time || item.release_time + 7776000000
        this.scheme = item.snapshot.scheme
        this.days = this.convertArr(item.snapshot.periodic_day)
        this.limits = this.convertArr(item.snapshot.use_restriction)
        this.status = item.status
    }

    get s1() {
        return this.step1()
    }

    get s2() {
        return this.step2()
    }

    get s3() {
        return this.step3()
    }

    //数组元素类型转换：将数组中符合条件的元素转换为数字
    convertArr(arr) {
        return arr.map(item => {
            if (!isNaN(Number(item))) return Number(item)
            else return item
        })
    }

    //检查套餐剩余次数
    checkRemainingTimes(rtimes) {
        return rtimes > 0
    }

    //检查套餐是否有效
    isValid(expire_time) {
        return this.confirm_time <= expire_time
    }

    //计算钥匙及套餐有效期
    calcExpireTime(method, limits, scheme) {
        const time = new Date(this.confirm_time)
        let expires = []
        switch (method) {
            case 0:
                return -1
            case 1:
                if (limits[0] === 0) {
                    expires[0] = expires[1] = time.setMinutes(time.getMinutes() + this.compare[2])
                } else if (limits[0] === 1) {
                    let t1 = time.setMinutes(time.getMinutes() + this.counter)
                    let tmp = time.setHours(limits[2].split(':')[0])
                    let t2 = new Date(tmp).setMinutes(limits[2].split(':')[1])
                    expires[0] = t1 > t2 ? t2 : t1
                    expires[1] = t2
                } else if (limits[0] === 2) {
                    expires[0] = time.setMinutes(time.getMinutes() + this.compare[2])
                    expires[1] = new Date(new Date(time.setDate(time.getDate() + 30)).setHours(23)).setMinutes(59)
                }
                return expires
            case 2:
            case 3:
                if (limits[0] === 0) {
                    switch (scheme) {
                        case 0:
                            expires[0] = expires[1] = new Date(time.setHours(23)).setMinutes(59)
                            break
                        case 1:
                            expires[0] = expires[1] = new Date(new Date(time.setDate(time.getDate() + this.counter - 1)).setHours(23)).setMinutes(59)
                            break
                        case 2:
                            expires[0] = new Date(time.setHours(23)).setMinutes(59)
                            expires[1] = new Date(new Date(time.setDate(time.getDate() + 30)).setHours(23)).setMinutes(59)
                            break
                    }
                } else if (limits[0] === 1) {
                    let t1 = time.setMinutes(time.getMinutes() + this.counter)
                    let tmp = time.setHours(limits[2].split(':')[0])
                    let t2 = new Date(tmp).setMinutes(limits[2].split(':')[1])
                    expires[0] = t1 > t2 ? t2 : t1
                    expires[1] = new Date(t2).setDate(time.getDate() + this.counter - 1)
                } else if (limits[0] === 2) {
                    expires[0] = time.setMinutes(time.getMinutes() + this.compare[2])
                    expires[1] = new Date(new Date(time.setDate(time.getDate() + 30)).setHours(23)).setMinutes(59)
                }
                return expires
        }
    }

    //1.周期管理
    step1() {
        let today = new Date(this.confirm_time).getDay()
        today = today !== 0 ? today : 7
        //起始日在周期范围内或周期为 0 则代表可用，否则不可用
        if (this.days.includes(today) || !this.days[0]) return true
        else throw new Error('您选择的起始日不可用，可用周期：' + this.days)
    }

    //2.附加限制管理
    step2() {
        switch (this.limits[0]) {
            //方案0：无附加限制
            case 0:
                return true
            //方案1：限制使用时段
            case 1:
                let hour = this.compare[0]
                let min = this.compare[1]
                let start = this.limits[1].split(':')
                start[0] = Number(start[0])
                start[1] = Number(start[1])
                let end = this.limits[2].split(':')
                end[0] = Number(end[0])
                end[1] = Number(end[1])
                //检查用户选择的起始时间是否处于可使用时段
                if ((start[0] * 60 + start[1] <= hour * 60 + min) && (hour * 60 + min <= end[0] * 60 + end[1])) {
                    //检查用户选择的起始时间+使用时长是否超出可使用时段
                    if (hour * 60 + min + this.compare[2] <= end[0] * 60 + end[1]) return true
                    else throw new Error('您选择的使用时长超出使用时段：' + this.limits[1] + '-' + this.limits[2])
                } else throw new Error('您选择的起始时间不在使用时段：' + this.limits[1] + '-' + this.limits[2])
            //方案2：限制最低使用时长
            case 2:
                //检查用户选择的使用时长是否大于等于最低限制时长，最后一次要求全部使用完毕
                if (this.compare[2] >= this.limits[1]) return true
                else if (this.rtimes * 60 < this.limits[1]) return true
                else throw new Error('您选择的使用时长小于最低限制：' + this.limits[1] + '分钟')
        }
    }

    //3.计数器管理
    step3() {
        const et = new Date(this.expire_time)
        const str = `${et.getFullYear()}-${et.getMonth() + 1}-${et.getDate()} ${et.getHours() > 9 ? '' : '0'}${et.getHours()}:${et.getMinutes() > 9 ? '' : '0'}${et.getMinutes()}:${et.getSeconds() > 9 ? '' : '0'}${et.getSeconds()}`
        const time = new Date(this.confirm_time)
        if (!this.isValid(this.expire_time)) throw new Error('您选择的起始时间已超出套餐有效期' + str + '\n如果该套餐尚未使用请联系客服退款')
        if (this.counting_method === 1 && (this.compare[2] > this.rtimes)) throw new Error('您选择的使用时长大于套餐余量')
        if (!this.checkRemainingTimes(this.rtimes)) throw new Error('该套餐已使用完毕，不可继续使用，请您重新选择使用套餐')
        switch (this.counting_method) {
            case 1:
                if (this.scheme) {
                    this.rtimes -= this.compare[2]
                    return {
                        msg: '本次预约完成后，剩余可用时长：' + this.rtimes + '分钟（' + (this.rtimes / 60).toFixed(2) + '小时）',
                        remaining: this.rtimes,
                        consumed: this.compare[2],
                        expire_time: this.calcExpireTime(1, this.limits, this.scheme)
                    }
                } else {
                    this.rtimes = 0
                    return {
                        msg: '该套餐需一次性使用完毕。为避免少选造成损失，使用时长将直接采用套餐约定时长，请您知悉',
                        remaining: this.rtimes,
                        consumed: this.counter,
                        expire_time: this.calcExpireTime(1, this.limits, this.scheme)
                    }
                }
            case 2:
                if (this.scheme === 1) {
                    this.rtimes -= 1
                    return {
                        msg: '本次预约完成后，剩余可用数量：' + this.rtimes + '日',
                        remaining: this.rtimes,
                        consumed: this.counter - this.rtimes,
                        expire_time: this.calcExpireTime(2, this.limits, this.scheme)
                    }
                } else {
                    this.rtimes = 0
                    let nt = new Date(time.setDate(time.getDate() + (this.counter - 1)))
                    nt.setHours(23)
                    nt.setMinutes(59)
                    nt.setSeconds(59)
                    nt.setMilliseconds(0)
                    return {
                        msg: '该套餐需连续使用。完成选座后，该座位将为您保留到套餐使用完毕，选座需慎重。剩余可用数量：' + Math.floor((this.expire_time - this.confirm_time) / 86400000) + '日',
                        remaining: this.rtimes,
                        consumed: this.counter - this.rtimes,
                        expire_time: this.calcExpireTime(2, this.limits, this.scheme)
                    }
                }
            case 3:
                if (this.scheme === 1) {
                    this.rtimes -= 1
                    return {
                        msg: '本次预约完成后，剩余可用数量：' + this.rtimes + '次',
                        remaining: this.rtimes,
                        consumed: this.counter - this.rtimes,
                        expire_time: this.calcExpireTime(3, this.limits, this.scheme)
                    }
                } else {
                    this.rtimes = 0
                    return {
                        msg: '该套餐需连续使用。完成选座后，该座位将为您保留到套餐使用完毕，选座需慎重。剩余可用数量：' + Math.floor((this.expire_time - this.confirm_time) / 86400000) + '次',
                        remaining: this.rtimes,
                        consumed: this.counter - this.rtimes,
                        expire_time: this.calcExpireTime(3, this.limits, this.scheme)
                    }
                }
        }
    }

    //主进程管理
    main() {
        try {
            this.s1
            this.s2
            return this.s3
        } catch (e) {
            throw e.message
        }
    }
}

try {
    let item = {
        "_id": "8f75309d62944c6c06195492007da018",
        "status": 0,
        "total": 120.0,
        "uid": "bicdd_13677123184",
        "consumed": 0,
        "order_id": "16530192109406568778",
        "records": ["165390986574751", "165399234814429"],
        "remaining": 120,
        "snapshot": {
            "_id": "0ab5303b627bdcab02d667303d5b9aa4",
            "bid": ["37020201"],
            "counter": 90,
            "counting_method": 1,
            "create_time": 1.652284587014E+12,
            "icon": "off",
            "keys": "每个账号仅限购买一次",
            "meituan_dealid": "920333320",
            "name": "2小时体验卡",
            "periodic_day": ["0"],
            "pid": "1001",
            "price": 6.99,
            "repeat": false,
            "rules": ["本券仅限公共学习区内单人座位使用", "本券为单日单次体验券，不支持拆分使用", "本券仅限新客购买，不可重复购入"],
            "scheme": 0,
            "scope": "normal",
            "tags": [{"content": "新客特惠", "style": "special"}],
            "text": "2小时",
            "type": 1.0,
            "update_time": 1.653299295848E+12,
            "use_restriction": ["1", '7:00', '9:00']
        },
        "counting_method": 1,
        "release_time": 1.653048031E+12
    }
    let input = {
        compare: [8, 0, 60],
        timestamp: new Date('2022/06/06 08:00').getTime()
    }
    const result = new Scheme(item, input).main()
    console.log('预约结果：' + result.msg, '钥匙到期时间：' + new Date(result.expire_time[0]), '套餐到期时间：' + new Date(result.expire_time[1]))
} catch (e) {
    console.log(e)
}