$( document ).ready(function() {
    console.log( 'ready!' );

    //Finds all posts the user has already commented on or liked
    $(".post-item").each(function (index){
      //console.log($(this).find(".commented").text())
      if ($(this).find(".commented").text() == "true"){
        //console.log("rendering good  " + $(this).find(".comment-body"))
        $(this).find(".comment-body").css("display", "none")
        $(this).find(".comment-button").css("display", "none")
        $(this).find(".remove-comment").css("display", "block")
      }
      if ($(this).find(".commented").text() == "false"){
        //console.log("rendering bad  " + $(this).find(".comment-body"))
        $(this).find(".comment-body").css("display", "block")
        $(this).find(".comment-button").css("display", "block")
        $(this).find(".remove-comment").css("display", "none")
      }

      if ($(this).find(".liked").text() == "true"){
        console.log("post liked")
        $(this).find(".like-button").attr("src","/public/img/filled_heart.png")
      }
      if ($(this).find(".liked").text() == "false"){
        console.log("post not liked")
        $(this).find(".like-button").attr("src","/public/img/unfilled_heart.png")
      }

  })


 



  $(".comment-button").click(function (e){
    e.preventDefault();
      var parent = $(this).parent()
      var comment_msg = parent.find(".comment-body").val()
      if (typeof(comment_msg) == "string" && comment_msg.trim().length > 0){
        //clears error msg
        parent.find(".error-comment").text("")
        let postId = parent.find(".postId").text()

        //object the ajax request will send containing the comment
        let comment_data = {
          "postId": postId,
          "msg": comment_msg,
          "add": true,
        }

        //ajax request
        $.ajax({
          type: "POST",
          url: "/feed",
          data: comment_data,
          success: function (response){
            console.log(response)
            parent.find(".comment-wrapper").append(response)
            parent.find(".comment-body").css("display", "none")
            parent.find(".comment-button").css("display", "none")
            parent.find(".remove-comment").css("display", "block")
          }


        })

      }else{
        //No input is put in
        parent.find(".error-comment").text("Please input text")
      }

    
  })

  $(".remove-comment").click(function (e){
    console.log("remove button clicked!")
    e.preventDefault();
    var parent = $(this).parent()
    let postId = ""
    console.log("before = " + postId)
    postId = parent.parent().find(".postId").text()
    //sometimes the the postId is duplicated so this makes sure only one instance of the id is used as postId
    postId = postId.substring(0,24)
    console.log("after clicked remove button postId = " + postId)


      //object the ajax request will send containing the comment
      let comment_data = {
        "postId": postId,
        "remove": true
      }

      //ajax request
      $.ajax({
        type: "POST",
        url: "/feed/remove",
        data: comment_data,
        success: function (response){
          console.log(response)
          parent.find(".remove-comment").css("display", "none")

          let userId = $("#session-user").text()
          parent.find(".comment-item").each(function (index){
            if ($(this).find(".comment-userId").text() == userId){
              $(this).remove()
            }
          })
          parent.find(".comment-body").css("display", "block")
          parent.find(".comment-button").css("display", "block")
          postId = ""
        }
      })

    })



  });

  $(".like-button").click(function (e){
    console.log("like button pressed!")


    e.preventDefault();
    var parent = $(this).parent()
    let postId = ""
    postId = parent.parent().find(".postId").text()
    //sometimes the the postId is duplicated so this makes sure only one instance of the id is used as postId
    postId = postId.substring(0,24)

    let like_date = {
      "postId": postId
    }

  
    if ($(this).attr('src') == "/public/img/unfilled_heart.png")  {
      $.ajax({
        type: "POST",
        url: "/feed/like",
        data: like_date,
        success: function (response){
          console.log(response)
      }})

      //update local like counter
      let counter = parent.find(".likes").text()
      counter = parseInt(counter) + 1


      if (counter == 1){
        //setup the html element string
        let input_text = "<p class='together likes'><strong>" + counter + "</strong> Like</p>"
        parent.find(".likes").html(input_text)
      }else{
        //setup the html element string
        let input_text = "<p class='together likes'><strong>" + counter + "</strong> Likes</p>"
        parent.find(".likes").html(input_text)
      }


      $(this).attr('src',"/public/img/filled_heart.png")
    }else{

      $.ajax({
        type: "POST",
        url: "/feed/unlike",
        data: like_date,
        success: function (response){
          console.log(response)
      }})
      $(this).attr('src',"/public/img/unfilled_heart.png")
      //update local like counter
      let counter = parent.find(".likes").text()
      counter = parseInt(counter) - 1

      if (counter == 1){
        //setup the html element string
        let input_text = "<p class='together likes'><strong>" + counter + "</strong> Like</p>"
        parent.find(".likes").html(input_text)
      }else{
        //setup the html element string
        let input_text = "<p class='together likes'><strong>" + counter + "</strong> Likes</p>"
        parent.find(".likes").html(input_text)
      }
    }


  })
