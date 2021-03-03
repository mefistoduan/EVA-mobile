import Mock from "mockjs";

let Random = Mock.Random;

// worldDetail
let worldDetail = function() {
	let item = [];
	for (var i = 0; i < 30; i++) {
		item.push({
			id: "@guid",
			name: "@region",
			Confirmed: "@integer(36844, 368449)",
			Deaths: "@integer(1099, 10993)",
			Recovered: "@integer(1986, 19865)",
		});
	}

	let res = {
		Rs: item,
		Code: 0,
		Memo: "",
	};
	return res;
};

let testPic = function() {
	let res = {
		pic: Random.image("200x100", "#894FC4", "#FFF", "@natural(1111, 9999)"),
		id: "@guid",
		Code: 0,
		Memo: "",
	};
	return res;
};

let testTable = function() {
	let item = [];

	let members = [
		{ id: 1, name: "霍元甲", userCode: "15253135600", vipType: 1 },
		{ id: 2, name: "陈真", userCode: "15253135602", vipType: 2 },
		{ id: 3, name: "成龙", userCode: "15253135604", vipType: 1 },
	];

	for (var i = 0; i < 6; i++) {
		item.push({
			id: "@guid",
			userCode: "@integer(15253135600, 15253135699)",
			name: "@region",
			tel: "@integer(15253135600, 15253135699)",
			shop: "@region",
			create: "@datetime",
			expTime: "@date",
			valid: "@datetime",
			Confirmed: "@integer(36844, 368449)",
			Deaths: "@integer(1099, 10993)",
			kick: "@integer(199, 993)",
			Recovered: "@integer(1986, 9999)",
			Status: "0",
			level: "0",
			// "Status": "@integer(1, 2)",
			color: "@hex",
			memo: "@paragraph(1, 1)",
			dialogValue: "@range(1, 3)",
			vipType: "@integer(1, 2)",
			members: members,
			wxVisible: "@integer(0, 1)",
			timeLong: "14:00-16:00",
			timeScope: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
		});
	}

	let res = {
		Rs: item,
		Code: 0,
		Memo: "",
	};
	return res;
};

let testSelect = function() {
	let item = [];
	for (var i = 0; i < 30; i++) {
		item.push({
			key: i + 1,
			value: i + 1,
			label: "@region",
		});
	}

	let res = {
		Rs: item,
		Code: 0,
		Memo: "",
	};
	return res;
};

let PhoneSignIn = function() {
	let Rs = {
		token: "@guid",
	};
	let res = {
		Rs: Rs,
		Code: 0,
		Memo: "登陆成功",
	};
	return res;
};

let editbasicinfo = function() {
	let res = {
		Code: 0,
		Memo: "修改成功",
	};
	return res;
};

let modPwd = function() {
	let res = {
		Code: 0,
		Memo: "修改成功",
	};
	return res;
};
let logout = function() {
	let res = {
		Code: 0,
		Memo: "退出成功",
	};
	return res;
};

let ManagerSelfQuery = function() {
	let res = {
		Code: 0,
		Rs: {
			ShopId: 1,
		},
		Memo: "退出成功",
	};
	return res;
};

let OrderShopQuery = function() {
	let res = {
		Code: 0,
		Rs: [
			{
				ShopID: 3,
				Status: 1,
				ShopName: "=====第三东京都",
				Addr: "经十路112233",
				RemainOrdernum: 1,
				RemainOrdernum: 3,
				IsJoin: 1,
				WxStatus: 1,
			},
			{
				ShopID: 4,
				Status: 1,
				ShopName: "=====11区战略",
				Addr: "经十路112233",
				RemainOrdernum: 1,
				RemainOrdernum: 3,
				IsJoin: 1,
				WxStatus: 1,
			},
			{
				ShopID: 5,
				Status: 1,
				ShopName: "=====紧急事态部",
				Addr: "经十路112233",
				RemainOrdernum: 1,
				RemainOrdernum: 3,
				IsJoin: 2,
				WxStatus: 1,
			},
		],
		Memo: "",
	};
	return res;
};

let GenVerifyPic = function() {
	return {
		Id: "CBoNKnkO7nFMxjfbMyXG",
		Pic:
			"data:image/png;base64,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",
	};
};

let CanOrderSchoolTimeTableListQuery = function() {
	let res = {
		Code: 0,
		Memo: "执行成功",
		Rs: [
			{
				StdId: 2021,
				Basic: null,
				StbId: 33,
				CurrentDate: "2021-03-03",
				WeekDay: 3,
				BeginTime: "2021-03-03T17:20:00+08:00",
				EndTime: "2021-03-03T18:20:00+08:00",
				BeginStr: "17:20",
				EndStr: "18:20",
				ClassId: 7,
				OrderToplimit: 8,
				ConsumeHour: 2,
				LessonIndex: 1,
				WxVisible: 1,
				WxOrder: 1,
				FinishClass: 0,
				SvId: 0,
				SvName: "",
				TId: 0,
				HrClassOn: 0,
				HrClassOff: 0,
				DpId: 0,
				PkNum: 0,
				ClassType: 0,
				Base: {
					CreatedAt: "2021-03-01T09:54:12.20731+08:00",
					CreateUser: 13,
					UpdatedAt: "2021-03-01T09:54:12.20731+08:00",
					LasteditUser: 13,
				},
				ClassName: "功能课",
				ClassColor: "#8ABFF7",
				OrderCount: 0,
				OrderId: 0,
				IsAllowSelect: 7,
			},
			{
				StdId: 2023,
				Basic: null,
				StbId: 33,
				CurrentDate: "2021-03-03",
				WeekDay: 3,
				BeginTime: "2021-03-03T18:30:00+08:00",
				EndTime: "2021-03-03T19:30:00+08:00",
				BeginStr: "18:30",
				EndStr: "19:30",
				ClassId: 8,
				OrderToplimit: 1,
				ConsumeHour: 4,
				LessonIndex: 3,
				WxVisible: 1,
				WxOrder: 1,
				FinishClass: 0,
				SvId: 0,
				SvName: "",
				TId: 0,
				HrClassOn: 0,
				HrClassOff: 0,
				DpId: 0,
				PkNum: 0,
				ClassType: 0,
				Base: {
					CreatedAt: "2021-03-01T09:54:12.208358+08:00",
					CreateUser: 13,
					UpdatedAt: "2021-03-01T09:54:12.208358+08:00",
					LasteditUser: 13,
				},
				ClassName: "个人训练",
				ClassColor: "#FCC66C",
				OrderCount: 0,
				OrderId: 0,
				IsAllowSelect: 8,
			},
		],
	};
	return res;
};
let QueryNextWeek = function() {
	let res = {
		Code: 0,
		Memo: "执行成功",
		Rs: 5,
	};
	return res;
};

let OrderListQuery = function() {
	let res = {
		Code: 0,
		Memo: "执行成功",
		Rs: [
			{
				OrderId: 672,
				ShopId: 7,
				UserId: 140,
				StdId: 1907,
				ShopName: "11区户外店",
				ClassId: 7,
				ClassName: "功能课",
				BeginTime: "2021-02-25T16:10:00+08:00",
				EndTime: "2021-02-25T17:10:00+08:00",
				CurrentDate: "2021-02-25",
				WeekDay: 4,
				BeginStr: "16:10",
				EndStr: "17:10",
				Status: 1,
				ConId: 0,
				Base: {
					CreatedAt: "2021-02-25T15:23:51.854887+08:00",
					CreateUser: 140,
					UpdatedAt: "2021-02-25T15:23:51.854887+08:00",
					LasteditUser: 140,
				},
				StbId: 31,
				OrderToplimit: 8,
				ConsumeHour: 2,
				WxVisible: 1,
				WxOrder: 1,
				FinishClass: 4,
				ClassColor: "#8ABFF7",
				UserName: "明日香",
				Phone: "15253135699",
				RemainHour: "",
			},
		],
	};
	return res;
};

let VipUserConsumeListQuery = function() {
	let res = {
		Code: 0,
		Memo: "执行成功",
		Rs: [
			{
				ConId: 1222,
				UserId: 140,
				NormalHour: 1,
				GiftHour: 0,
				PreNormalhour: 11,
				PreGifthour: 0,
				AfterNormalhour: 10,
				AfterGifthour: 0,
				StdId: 1840,
				ShopId: 3,
				AcrossConsume: 0,
				ShopName: "11区蒙正店",
				ClassName: "基础体能",
				BeginTime: "2021-02-26T16:10:00+08:00",
				EndTime: "2021-02-26T17:10:00+08:00",
				OrderId: 0,
				CfId: 1481,
				ConType: 0,
				CreatedAt: "2021-02-26T15:23:59.33405+08:00",
				SelfNormalHour: 0,
				SelfGiftHour: 0,
				ClassColor: "#F89A9A",
				Name: "明日香",
				Phone: "15253135699",
			},
			{
				ConId: 1202,
				UserId: 140,
				NormalHour: 2,
				GiftHour: 0,
				PreNormalhour: 13,
				PreGifthour: 0,
				AfterNormalhour: 11,
				AfterGifthour: 0,
				StdId: 1907,
				ShopId: 7,
				AcrossConsume: 1,
				ShopName: "小飞龙户外店",
				ClassName: "功能课",
				BeginTime: "2021-02-25T16:10:00+08:00",
				EndTime: "2021-02-25T17:10:00+08:00",
				OrderId: 672,
				CfId: 1457,
				ConType: 1,
				CreatedAt: "2021-02-25T15:57:16.781314+08:00",
				SelfNormalHour: 0,
				SelfGiftHour: 0,
				ClassColor: "#8ABFF7",
				Name: "明日香",
				Phone: "15253135699",
			},
		],
		PageCount: 17,
	};
	return res;
};

let VipUserSelfQuery = function() {
	let res = {
		Code: 0,
		Memo: "执行成功",
		Rs: {
			Name: "明日香",
			Phone: "15253135600",
			CalorieMonth: 967,
			CalorieTotal: 967,
			CKTotal: 9,
			CKMonth: 9,
		},
	};
	return res;
};

let MyShopQuery = function() {
	let res = {
		Code: 0,
		Memo: "执行成功",
		Rs: [
			{
				ShopID: 3,
				ShopName: "11区紧急行动",
				Addr: "第三东京都加持路515号",
				Phone: "152531356900",
				Contacts: "加持老师",
				ContactsPhone: "",
				Memo: "",
				Status: 1,
				WxStatus: 1,
				ServiceId: 5,
				ServiceKey: "BF378BE09D361A33",
				Base: {
					CreatedAt: "2020-10-26T15:16:01.170154+08:00",
					CreateUser: 1,
					UpdatedAt: "2020-10-29T23:15:37.770919+08:00",
					LasteditUser: 1,
				},
				RemainOrdernum: 0,
				OrderLimit: 0,
				OrderNum: 0,
				VipType: 1,
				ClassHourToatal: 43,
				ClassHourRemain: 10,
				ClassHourConsume: 33,
				ExpTime: 1644249599,
				IsJoin: 0,
			},
		],
	};
	return res;
};

let VipUserCleCkSum = function() {
	let res = {"Code":0,"Memo":"执行成功","Cle":967,"CleMonth":967,"Ck":9,"CkMonth":9}
	return res;
};

Mock.mock("/api/testPic", "post", testPic());
Mock.mock("/api/testSelect", "post", testSelect());
Mock.mock("/api/testTable", "post", testTable());
Mock.mock("/api/worldDetail", "post", worldDetail());
Mock.mock("/api/editbasicinfo", "post", editbasicinfo()); //用户设置修改
Mock.mock("/api/modPwd", "post", modPwd()); //密码修改
Mock.mock("/api/logout", "post", logout()); //退出登陆

Mock.mock("/api/v1/Auth/PhoneSignIn", "post", PhoneSignIn()); //用户登录
Mock.mock("/api/v1/Auth/GenVerifyPic", "post", GenVerifyPic()); //验证码
Mock.mock("/api/v1/Auth/GetPhoneVFCode", "post", PhoneSignIn()); //获取验证码
Mock.mock("/api/v1/User/ManagerSelfQuery", "post", ManagerSelfQuery()); //获取验证码
Mock.mock("/api/v1/Weixin/OrderShopQuery", "post", OrderShopQuery()); //
Mock.mock("/api/v1/Weixin/QueryNextWeek", "post", QueryNextWeek());
Mock.mock("/api/v1/Weixin/CanOrderSchoolTimeTableListQuery", "post", CanOrderSchoolTimeTableListQuery());
Mock.mock("/api/v1/Weixin/OderAddByVipUser", "post", QueryNextWeek());
Mock.mock("/api/v1/Weixin/OrderListQuery", "post", OrderListQuery());
Mock.mock("/api/v1/Weixin/VipUserConsumeListQuery", "post", VipUserConsumeListQuery());
Mock.mock("/api/v1/Weixin/OderCancelByVipUser", "post", PhoneSignIn());
Mock.mock("/api/v1/Weixin/VipUserSelfQuery", "post", VipUserSelfQuery());
Mock.mock("/api/v1/Weixin/MyShopQuery", "post", MyShopQuery());
Mock.mock("/api/v1/Weixin/VipUserCleCkSum", "post", VipUserCleCkSum());

export default Mock;
