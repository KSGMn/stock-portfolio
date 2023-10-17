module.exports = {
  HTML: function (title, body, authStatusUI) {
    return `
      <!doctype html>
      <html>
      <head>    
        <title>Login TEST - ${title}</title>
        <meta charset="utf-8">
        <style>
          @import url(http://fonts.googleapis.com/earlyaccess/notosanskr.css);
  
          body {
        
              font-family: 'Noto Sans KR', sans-serif;
              background-color: #fff;
              margin: 50px;
             
          }
  
          .background {
              background-color: white;
              height: auto;
              width: 90%;
              max-width: 450px;
              padding: 10px;
              margin: 0 auto;
              border-radius: 5px;
              box-shadow: 0px 0px 30px 5px rgba(52, 152, 219, 0.5);
              text-align: center;
              
          }
  
          form {
              display: flex;
              padding: 30px;
              flex-direction: column;
          }

          a {
            color : #3498db;
          }
  
          .login {
              border: none;
              border-bottom: 2px solid #D1D1D4;
              background: none;
              padding: 10px;
              font-weight: 700;
              transition: .2s;
              width: 75%;
          }
          .login:active,
          .login:focus,
          .login:hover {
              outline: none;
              border-bottom-color: #3498db;
          }
  
          .btn {            
              border: none;
              width: 75%;
              background-color: #3498db;
              color: white;
              padding: 15px 0;
              font-weight: 600;
              border-radius: 5px;
              cursor: pointer;
              transition: .2s;
          }
          .btn:hover {
               background-color: #2980b9;
          }

          .phoneNum {
            width: 90px;
            height: 30px;
            border: 1px solid #d2d2d2;
            border-radius: 7px;
            font-size: 16px;
            text-align: center;
          }

          .token,
          .token__timer {
            color: #595787;
            font-size: 18px;
            display: flex;
            align-items: center;
          }

          .token__wrapper {
            display: flex;
            justify-content: end;
            padding-right: 40px;
            margin-bottom: 15px;
            margin-top: 15px;
          }

          #token__button,
          #token__timer__confirm__button {
            width: 120px;
            height: 40px;
            border-radius: 7px;
            margin-left: 20px;
            border: 1px solid #d2d2d2;
            font-size: 16px;
          }
      </style>
      </head>
      <body>
        <div class="background">
          ${authStatusUI}
          ${body}
        </div>
      </body>
      </html>
      `;
  },
};
