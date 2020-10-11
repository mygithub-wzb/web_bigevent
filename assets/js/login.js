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
})