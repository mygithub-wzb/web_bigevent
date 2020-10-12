$(function () {
    // 获取用户登录信息
    getUserInfo();

    $('#btnlogoout').on('click', function () {
        layer.confirm('确认退出?', { icon: 3, title: '提示' },
            function (index) {
                localStorage.removeItem('token')
                location.href = '/login.html'
                layer.close(index);
            });
    })

})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: res => {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // console.log(res);
            getUserActive(res.data)
        }
    })
}

function getUserActive(user) {
    var name = user.nickname || user.username;
    $('#welcome').html("欢迎     " + name)
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.user-active').hide()
    } else {
        $('.layui-nav-img').hide()
        $('.user-active').html(name[0].toUpperCase()).show()
    }
}