<template>
    <div>
        <div class="demo-picker-container citypickerContainer">
            <p @click="pickerState = true">
                <span> {{addressProvince}} <img src="../static/images/comm/cityPicker.png" alt=""></span>
                <span> {{addressCity}} <img src="../static/images/comm/cityPicker.png" alt=""></span>
                <span> {{addressCounty}} <img src="../static/images/comm/cityPicker.png" alt=""></span>
            </p>
            <mu-slide-picker
                    v-show="pickerState"
                    :slots="addressSlots"
                             :visible-item-count="7"
                             @change="addressChange"
                             :values="address"></mu-slide-picker>
            <mu-button id="closeBtn" color="warning" @click="pickerState = false" v-show="pickerState">收起</mu-button>

        </div>
    </div>
</template>

<script>
    import myaddress from '../components/address3.json'

    export default {
        data() {
            return {
                addressSlots: [
                    {
                        width: '100%',
                        textAlign: 'right',
                        values: Object.keys(myaddress)
                    }, {
                        width: '100%',
                        textAlign: 'left',
                        values: Object.keys(myaddress['山东省']),
                    }, {
                        width: '100%',
                        textAlign: 'left',
                        values: myaddress['山东省']['济南市'],
                    }
                ],
                address: ['山东省', '济南市', '历下区'],
                addressProvince: '山东省',
                addressCity: '济南市',
                addressCounty: '历下区',
                pickerState: false,
            }
        },
        created() {
        },
        methods: {
            addressChange(value, index) {
                switch (index) {
                    case 0:
                        this.addressProvince = value;
                        let ProvinceName = value.substring(0, value.length - 1);
                        this.addressSlots[1].values = address[ProvinceName];
                        this.addressCity = address[ProvinceName][0] + '市';
                        break;
                    case 1:
                        this.addressCity = value;
                        let arrCity = myaddress[this.addressProvince][value];
                        this.addressSlots[2].values = arrCity;
                        this.addressCounty = arrCity[0];
                        break;
                    case 2:
                        this.addressCounty = value;
                        break
                }
                this.address = [this.addressProvince, this.addressCity, this.addressCounty];
                localStorage.defaultProv =this.addressProvince.substring(0, this.addressProvince.length - 1);
                localStorage.defaultCity =this.addressCity.substring(0, this.addressCity.length - 1);
                localStorage.defaultArea =this.addressCounty;
            }
        }
    }
</script>

<style scoped>
    .demo-picker-container {
        width: 100%;
    }
    .citypickerContainer {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
    }

    .citypickerContainer p {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
    }

    .citypickerContainer p span {
        width: 94px;
        float: left;
        border: 1px solid #D5D5D5;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        padding-left: 10px;
        padding-right: 10px;
        margin-right: 3%;
    }

    .citypickerContainer p span:nth-child(3) {
        margin-right: 0;
        float: left;
    }

    .citypickerContainer p span img {
        float: right;
        width: 8px;
        margin-top: 10px;
    }
    .pickerPart {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
    }

    .center {
        width: 100px;
        overflow: hidden;
        display: block;
        margin: 0 auto;
        font-size: 12px;
    }
    #closeBtn {
        width: 100%;
        overflow: hidden;
        display: block;
        margin: 0 auto;
    }
</style>
