$(function () {
    // 点击去注册账号的链接
    $('#link_reg').on('click', function () {
        $('.login_box').hide()
        $('.reg_box').show()
    })
    // 点击去登录账号的链接
    $('#link_login').on('click', function () {
        $('.login_box').show()
        $('.reg_box').hide()
    })
    // 提交验证
    var form = layui.form
    var layer=layui.layer
    form.verify({
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repass: function (value) {
            var pwd = $('.reg_box [name=password]').val()
            if (pwd != value) {
                return '两次密码输入不一致'
            }
        }
    })
    // 监听注册页面提交事件
    var url = 'http://ajax.frontend.itheima.net'
    $('#form_reg').on('submit', function (e) {
        // alert('11')
        e.preventDefault()
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post(url+'/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
              }
           layer.msg('注册成功，请登录！')
              // 模拟人的点击行为
              $('#link_login').click()
        })
    })
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: url + '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return  layer.msg('登录失败')
                }
                layer.msg('登录成功')
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })
})