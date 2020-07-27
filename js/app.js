var app = new Vue({
	el: "#app",
	data: data,
	methods: {
		bindRelationship(){
			var _this = this,search = window.location.search;
			var account = "";
			web3.eth.getCoinbase((err, coinbase) => {
			 	account = coinbase;
				var urlParams = {}
				if(search){
					search = search.slice(1);
					var searchArr = search.split("&");
					searchArr.map(item => {
						item = item.split("=");
						urlParams[item[0]] = item[1];
					});
				}
				//console.log((!urlParams.id),account,search,222);
				$.ajax({
					type: 'post',
					url: _this.baseUrl + "/user/register",
					data: { 
						"pid": urlParams.id?urlParams.id:"", 
						"addr": account
					},
					success: function (data) {
						//console.log(data);
						_this.linkData = data;
						_this.getUserData();
					}
				});
			}); 
		
		},
		getUserData(){
			var _this = this,
			account = "";
			web3.eth.getCoinbase((err, coinbase) => {
			 	account = coinbase;
				$.ajax({
					type: 'get',
					url: _this.baseUrl + "/user/getUserInfoByAddr",
					data: { 
						"addr": account
					},
					success: function (data) {
						//console.log(data);
						_this.linkData = data.data;
						_this.userData = data.data;
						_this.TimeDown('show', _this.userData.openPrizeDateL, 0); //倒计时方法
					}
				});
			}); 
			
		},
		getTimeDown(){
			var _this = this;
			var account = "";
			web3.eth.getCoinbase((err, coinbase) => {
			 	account = coinbase;
				$.ajax({
					type: 'get',
					url: _this.baseUrl + "/user/getOpenPrizeDate",
					success: function (data) {
						//console.log(data);
						_this.userData.openPrizeDateL = data.data.openPrizeDateL;
						_this.userData.futureEth =  data.data.futureEth;
						_this.TimeDown('show', _this.userData.openPrizeDateL, 0); //倒计时方法
					}
				});
			}); 
		
		},
		settlement(addr){
			var _this = this;
			var account = "";
			web3.eth.getCoinbase((err, coinbase) => {
			 	account = coinbase;
				$.ajax({
					type: 'post',
					url: _this.baseUrl + "/user/settle",
					data: { 
						"tradingAddr": addr
					},
					success: function (data) {
						//console.log("结算：" , data);
						_this.getUserData();
					}
				});
			}); 
		
		},
		withdrawalSubGwa(){
			var _this = this;
			var account = "";
			web3.eth.getCoinbase((err, coinbase) => {
			 	account = coinbase;
				$.ajax({
					type: 'post',
					url: _this.baseUrl + "/user/withdrawalSubGwa",
					data: { 
						"user_addr": account
					},
					success: function (data) {
						//console.log("额度：" , data);
						_this.getGwa(data.data);
					}
				});
			}); 
		
		},
		withdrawal(addr){
			var _this = this;
			var account = "";
			web3.eth.getCoinbase((err, coinbase) => {
			 	account = coinbase;
				$.ajax({
					type: 'post',
					url: _this.baseUrl + "/user/withdrawal",
					data: { 
						"tradingAddr": addr
					},
					success: function (data) {
						//console.log("提现：" , data);
						_this.getUserData();
					}
				});
			}); 
		
		},
		setCookie: function(name, value) {
			var Days = 7;
			var exp = new Date();
			exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
			document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
		},
		getCookie: function(name) {
			var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
			if(arr = document.cookie.match(reg))
				return unescape(arr[2]);
			else
				return null;
		},
		initLang: function() {
			var _this = this;
			var value = this.getCookie("lang");
			for(var key in _this.lang) {
				if(key == value) {
					_this.langItem = _this.lang[key];
					break;
				}

			}
		},
		changeLang: function(index) {
			this.setCookie("lang", index);
			this.initLang();
			this.showNav = false
		},
		getNavs: function() {
			this.showNav = !this.showNav;
		},
		tabGame: function(index) {
			this.gameCurrent = index
		},
		tabLottery: function(index) {
			this.lotteryCurrent = index
		},
		showPop: function(arg, callback) {
			if(arg == "directRules") {
				this.directRules = true
			} else if(arg == "smallRules") {
				this.smallRules = true
			} else if(arg == "seasonRules") {
				this.seasonRules = true
			} else if(arg == "gameHistory") {
				this.gameHistory = true;
				this.getRoundInfo();
			} else if(arg == "directPop") {
				this.directPop = true;
			} else if(arg == "groupPop") {
				this.groupPop = true;
			} else if(arg == "seasonPop") {
				this.seasonPop = true;
			}

		},
		hidePop: function() {
			this.directRules = false;
			this.smallRules = false;
			this.seasonRules = false;
			this.countError = false;
			this.sendError = false;
			this.gameHistory = false;
			this.directPop = false;
			this.groupPop = false;
			this.seasonPop = false;
			this.lotteryError = false;
			this.copySuccess = false;
			this.balanceError = false;
			this.sdfBalanceError = false;
			this.canPlay = false;
		},
		getJoin: function(val) {
			this.joinNumber = val;
		},
		getJoinNew: function(val) {
			this.joinNumberNew = val;
		},
		init: async function() {
			this.initLang();
			this.initSuperiorID();
			return await this.initWeb3();
		},
		initWeb3: async function() {
			//初始化过程
		
   //      let web3 = window.web3;
			// this.web3Provider = web3.currentProvider;
			// window.web3 = new window.Web3(web3.currentProvider);
			// console.log(window.web3)
		// if(window.ethereum) {
		// 	window.web3 = new Web3(ethereum);
		// 	try {
		// 		await ethereum.enable();
		// 		this.web3Provider = ethereum;
		// 	} catch(error) {}
		// } else if(window.web3) {
		// 	this.web3Provider = web3.currentProvider;
		// 	window.web3 = new window.Web3(window.web3.currentProvider);
		// } else {
		// 	console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
		// }
		// if (typeof web3 !== 'undefined') {
		//   web3 = new Web3(web3.currentProvider);
		// } else {
		//   // set the provider you want from Web3.providers
		//   web3 = new Web3(new Web3.providers.HttpProvider(web3.currentProvider));
		// }
		
		if(window.ethereum) {
			window.web3 = new Web3(ethereum);
			try {
				await ethereum.enable();
				this.web3Provider = ethereum;
			} catch(error) {}
		} else if(window.web3) {
			this.web3Provider = web3.currentProvider;
			window.web3 = new Web3(web3.currentProvider);
		} else {
			// console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
		}
		
		this.checkAccount();
		this.bindRelationship();
		return this.initGame();
			// this.checkAccount();
			// this.bindRelationship();
			// return this.initGame();
		},
		initToken: function() {
			app.initMyToken();
			// var _this = this;
			// $.getJSON('abi/DarkTokenERC20.json', function(data) {
			// 	_this.contracts.DarkToken = TruffleContract(data);
			// 	_this.contracts.DarkToken.setProvider(_this.web3Provider);
			// 	app.initMyToken();
			// });
		},
		initMyToken: function() {
			var _this = this;
			
			$.getJSON('abi/MyToken.json', function(data) {
				// _this.contracts.MyToken = TruffleContract(data);
				// _this.contracts.MyToken.setProvider(_this.web3Provider);
				_this.contracts.MyToken = new web3.eth.Contract(data,'0xb6eB39C1BC2D2618BbdB539ac5fb796EA3cE59dc');//合约abi接口;
				_this.contracts.MyToken.setProvider(_this.web3Provider);
				app.initGwaToken();
			});
		},
		initGwaToken: function() {
			var _this = this;
		
			$.getJSON('abi/GwaToken.json', function(data) {
				//console.log(data);
				// _this.contracts.GwaToken = TruffleContract(data);
				// _this.contracts.GwaToken.setProvider(_this.web3Provider);
				_this.contracts.GwaToken = new web3.eth.Contract(data,'0xa3b112a66576e0305f7628945ac79bd4c5801136');//合约abi接口;
				_this.contracts.GwaToken.setProvider(_this.web3Provider);
				app.initGameData();
			});
		},
		initGameData: function() {
			var _this = this;
			//_this.getGwa(10);
			_this.getEthBalance();//获取余额
			_this.getGwaBalance();//获取余额
			//rank
			_this.getRank();
			// _this.getNumber();//获取链头区块编号
			// _this.transferEth();//转账
			_this.getBalance(); //获取合约钱包
		},
		getRank: function() {
			var _this = this;
			var account = "";
			web3.eth.getCoinbase((err, coinbase) => {
			 	account = coinbase;
				$.ajax({
					type: 'get',
					url: _this.baseUrl + "/user/rank",
					success: function (data) {
						_this.rankArr = data.data;
					}
				});
			}); 
			
			
		},
		getGwa: function(num) {
			var _this = this,
				account = "";
				web3.eth.getCoinbase((err, coinbase) => {
				 	account = coinbase;
				
			
				// // 查看某个账号的代币余额
				// console.log(_this.contracts.GwaToken.methods)
					_this.contracts.GwaToken.methods.balanceOf(account).call({from: "0xa3b112a66576e0305f7628945ac79bd4c5801136"}, function(error, result){
					    if(!error) {
							//console.log(3333,num)
							// console.log(result)
							//num = num * 10 ** 18;
							num = web3.utils.toWei(num, 'ether');
							if(result >= (num-0)){
								
								_this.setApprove(num);
								
							}else{
								_this.sdfBalanceError = true;
								//console.log("gwa不足")
							}
					    } else {
					        // console.log(error);
					    }
					});
					
				}); 
		
		},
		setApprove: function(num) {
			var _this = this,
			account = "";
			// console.log(2222,num)
			web3.eth.getCoinbase((err, coinbase) => {
			 	account = coinbase;
				// account 钱包地址
				// console.log(_this.contracts.GwaToken.methods)
				var adminacount = _this.adminAcount;
				_this.contracts.GwaToken.methods.approve(adminacount, num+"").send({from: account,gasPrice:"88000000000"}, function(error, transactionHash){
					 // console.log(transactionHash)
					 if(transactionHash){
						 _this.userData.withdrawalEth = 0 ;
						 _this.userData.withdrawalGwa = 0;
					$.ajax({
						type: 'post',
						url: _this.baseUrl + "/user/addHashRecord",
						data: { 
							"txn_hash": transactionHash,
							"type": 4
						},
						success: function (data) {
							
						}
					}); 
					 }
				});
				
				
				
				// _this.contracts.GwaToken.deployed().then(function(instance) {
				// 	var adminacount = _this.adminAcount;
				// 	return instance.approve(adminacount, num);
				// }).then(function(result) {
				// 	//console.log(result);
				// 	_this.withdrawal(result.receipt.transactionHash);
				// }).catch(function(err) {
				// 	console.log(err.message + "at setApprove Error");
				// });
			}); 
			
		},
		getApprove: function() {
			var _this = this,
				account = "";
				web3.eth.getCoinbase((err, coinbase) => {
				 	account = coinbase;
					// account 钱包地址
					_this.contracts.GwaToken.deployed().then(function(instance) {
						var adminacount = _this.adminAcount;
						return instance.allowance(account, adminacount);
					}).then(function(result) {
						// console.log(result + "at getApprove");
					}).catch(function(err) {
						// console.log(err.message + "at getApprove Error");
					});
				}); 
			
		},
		transferEth: function(value,type) {
			var _this = this,
			account = "";
			web3.eth.getCoinbase((err, coinbase) => {
			 	account = coinbase;
				// var testAccount = "0xc9F9BA831DED5D9AEC30902cd4732DFf8be5902A";
				//var money = web3.utils.toWei(value, 'ether');
				if(type == 1){
					_this.contracts.GwaToken.methods.pay().send({from: account,value:value * 10 ** 18,gasPrice:"88000000000"}, function(error, transactionHash){
						 // console.log(transactionHash)
						 if(transactionHash){
							 $.ajax({
							 	type: 'post',
							 	url: _this.baseUrl + "/user/addHashRecord",
							 	data: { 
							 		"txn_hash": transactionHash,
							 		"type": 1
							 	},
							 	success: function (data) {
							 		
							 	}
							 });
						 }
						
					});
				}
				if(type == 2){
					// _this.contracts.MyToken.methods.pay().send({from: account,value:value * 10 ** 18}, function(error, transactionHash){
					// 	 // console.log(transactionHash)
					// 	 if(transactionHash){
					// 		$.ajax({
					// 			type: 'post',
					// 			url: _this.baseUrl + "/user/addHashRecord",
					// 			data: { 
					// 				"txn_hash": transactionHash,
					// 				"type": 2
					// 			},
					// 			success: function (data) {
									
					// 			}
					// 		}); 
					// 	 }
					
					// });
					_this.contracts.MyToken.methods.pay().send({from: account,value:value * 10 ** 18,gasPrice:"88000000000"}, function(error, transactionHash){
						 // console.log(transactionHash)
						 if(transactionHash){
							 
						 }
					
					});
				}
				if(type == 3){
					_this.contracts.GwaToken.methods.pay().send({from: account,value:value * 10 ** 18,gasPrice:"88000000000"}, function(error, transactionHash){
						 // console.log(transactionHash)
						 if(transactionHash){
							 _this.userData.noSettlementEth = 0 ;
							 _this.userData.noSettlementGwa = 0;
							 $.ajax({
							 	type: 'post',
							 	url: _this.baseUrl + "/user/addHashRecord",
							 	data: { 
							 		"txn_hash": transactionHash,
							 		"type": 3
							 	},
							 	success: function (data) {
							 		
							 	}
							 });
						 }
						
					});
				}
				if(type == 4){
					_this.withdrawalSubGwa();
				}
				
		
			}); 
	
			
		},
		getNumber: function() {
			var _this = this,
				account = "";
				web3.eth.getCoinbase((err, coinbase) => {
				 	account = coinbase;
			
					
					
					// 查看某个账号的代币余额
					_this.contracts.MyToken.methods.gwtNumber().call({from: "0xb6eB39C1BC2D2618BbdB539ac5fb796EA3cE59dc"}, function(error, result){
					    if(!error) {
							 // console.log(12,result)
					        // _this.gwaBalance = result / 10 ** 18;
					        // _this.gwaToEthBalance = result / 10 ** 18 / _this.gwaToEth;
					    } else {
					        // console.log(error);
					    }
					});
					
				}); 
		
			
		},
		getBalance: function() {
			var _this = this,
				account = "";
				web3.eth.getCoinbase((err, coinbase) => {
				 	account = coinbase;
					// account 钱包地址
					
					// 查看某个账号的代币余额
					_this.contracts.MyToken.methods.getBalance().call({from: "0xb6eB39C1BC2D2618BbdB539ac5fb796EA3cE59dc"}, function(error, result){
					    if(!error) {
							// console.log(12,result)
					        // _this.gwaBalance = result / 10 ** 18;
					        // _this.gwaToEthBalance = result / 10 ** 18 / _this.gwaToEth;
					    } else {
					        // console.log(error);
					    }
					});
					
				
				}); 
				
		
			
		},
		copy: function() {
			var _this = this;
			var clipboard = new ClipboardJS('.btn');
			clipboard.on('success', function(e) {
				e.clearSelection();
				_this.copySuccess = true;
			});

			clipboard.on('error', function(e) {
				alert("copy failed!")
			});
		},
		initGame: function() {
			app.initToken();
		},

		getPlayerInfo: function() {
			
		},
		protectAddress: function(addr) {
			return(addr + "").length == 42 ? addr.substring(0, 8) + "****" + addr.substring(36, 42) : addr;
		},
		initSuperiorID: function() {
			var reg = new RegExp('(^|&)' + 'id' + '=([^&]*)(&|$)');
			var r = window.location.search.substr(1).match(reg);
			if(r != null) {
				// console.log(decodeURIComponent(r[2]) + " initSuperiorID");
				this.superiorID = parseInt(decodeURIComponent(r[2]));
			} else {
				this.superiorID = 0;
				// console.log("initSuperiorID = 0");
			}
		},

		getEthBalance: function() {
			var _this = this;
		
			web3.eth.getCoinbase((err, coinbase) => {
				
				web3.eth.getBalance(coinbase)
				.then(function(result){
						_this.tokenBalance = result / 10 ** 18
						// console.log(result + "我的钱包 at getEthBalance", _this.ethBalance)
				});
				});
		
		},
	
		joinNumberUp: function(){
			var _this = this;
			var v = $("#gwaCount").val();
			var gwaPrice = _this.linkData.gwaPrice;
			_this.totalV = gwaPrice * v;
			v=v.replace(/[^\.\d]/g,'');
			v=v.replace('.','');
		},
		getGwaBalance: function() {
			var _this = this;
				web3.eth.getCoinbase((err, coinbase) => {
				 	account = coinbase;
					// account 钱包地址
					
					// 查看某个账号的代币余额
					_this.contracts.GwaToken.methods.balanceOf(account).call({from: "0xa3b112a66576e0305f7628945ac79bd4c5801136"}, function(error, result){
					    if(!error) {
					        _this.gwaBalance = result / 10 ** 18;
					        _this.gwaToEthBalance = result / 10 ** 18 / _this.gwaToEth;
					    } else {
					        // console.log(error);
					    }
					});
					
					
				}); 
		
		},
		handleBuy: function(event) {

		},
		getTokenBalance: function() {
			
		},
		getRoundInfo: function() {

		},
		handleGame: function() {
			var _this = this;
			_this.transferEth();
		},
		getTimeLeft: function() {
			
		},
		getsTimeLeft: function() {

		},
		TimeDisplay: function(id, totalSeconds) {
			var hours = Math.floor(totalSeconds / (60 * 60));
			if(hours < 10) {
				hours = "0" + hours;
			}
			var modulo = totalSeconds % (60 * 60);
			var minutes = Math.floor(modulo / 60);
			if(minutes < 10) {
				minutes = "0" + minutes;
			}
			modulo = modulo % 60;
			var seconds = modulo % 60;
			if(seconds < 10) {
				seconds = "0" + seconds;
			}

			$("#" + id).html("<span>" + hours + "</span>:<span>" + minutes + "</span>:<span>" + seconds + "</span>");
		},
		TimeDown: function(id, totalSeconds, interval_time) {
			var _this = this;
			if(totalSeconds <= 0) {
				setTimeout(function() {
					_this.getRewardInfo();
				}, 3000);
				totalSeconds = interval_time || 0;
			};

			_this.TimeDisplay(id, totalSeconds);

			if(totalSeconds > 0) {
				if(_this.timeId[id]){
					clearTimeout(_this.timeId[id]);
				}
				_this.timeId[id] = setTimeout(function() {
					_this.TimeDown(id, --totalSeconds, interval_time);
				}, 1000);
			}

		},
		handleLottery: function() {
			
		},
		getLotteryInfo: function() {
			
		},
		previous: function() {
			this.lotteryData.records.term--;
			if(this.lotteryData.records.term <= 1) {
				this.lotteryData.records.term = 1
			}
			this.getLotteryInfo();
		},
		next: function() {
			this.lotteryData.records.term++;
			if(this.lotteryData.records.term >= this.lotteryData.currentTimes) {
				this.lotteryData.records.term = this.lotteryData.currentTimes
			}
			this.getLotteryInfo();
		},
		CalcReward: function() {
			
		},
		gameReward: function() {
			
		},
		getRewardInfo: function() {
			
		},
		gameGetInfo: function() {
			
		},

		tokenGetInfo: function(update) {
			
		},
		checkAccount: function() {
			var _this = this;
			web3.eth.getCoinbase((err, coinbase) => {
			 	_this.account = coinbase;
				setInterval(function() {
					var account = ""
					web3.eth.getCoinbase((err, coinbase) => {
					 	account = coinbase;
						if(_this.account != account) {
							_this.account = account;
							window.location.reload();
						}
					}); 
					
				}, 3000);
			}); 
			
		},
	},
	computed: {
		getToken: function() {
			if(isNaN(this.gameData.ethRatio)) {
				return "--"
			}
			return parseFloat(this.ethNumber * this.gameData.ethRatio).toFixed(4)
		},
		joinToken: function() {
			if(isNaN(this.gameData.ethRatio)) {
				return "--"
			}
			return parseFloat(this.joinNumber * this.gameData.ethRatio / 10).toFixed(4)
		},
		lotteryToken: function() {
			if(isNaN(this.lotteryData.lotteryRatio)) {
				return "--"
			}
			return parseFloat(this.lotteryNumber * this.lotteryData.lotteryRatio).toFixed(4)
		},
		getFee: function() {
			if(isNaN(this.gameData.ethRatio)) {
				return "--"
			}
			return parseFloat(this.income.gameReward.eth * this.gameData.ethRatio * 3 / 100).toFixed(4)
		},
		getLink:function(){
			
			var _this = this;
			
			var url=_this.showUrl;
			//console.log(this.linkData);
			if(url.indexOf("?") != -1){
				var offest=url.indexOf("?");
				var newUrl=url.substr(0,offest);
				return newUrl+"?id="+this.linkData.id; //this.gameData.link.id;
			}else{
				return url+"?id="+this.linkData.id;
			}
		}
	},
	mounted: function() {
		var value = this.getCookie("lang");
		if(!value) {
			this.setCookie("lang", this.defaultLang);
		}
		this.init();
		this.getTimeDown();
		this.TimeDown('show', 0, 0); //倒计时方法
	}
})
