<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>
        <img />
    </div>
    <div>
        <div>
          <h6>Dear {{$data->name}}</h6>
        </div>
        <div>
          <div>
            <p>Welcome to Tritek Consulting Ltd Dev Arena Portal. Find the following your login details to the Dev Arena Portal, Please be sure to change your password on your first login to the platform.</p>
          </div>
          <div>
            <p>Username: {{$data['email']}}</p>
            <p>Password: {{$data->password}}</p>
          </div>
        </div>
        <div>
          <p>Sincerely,</p>
          <p>Tritek Consulting Ltd.</p>
        </div>
    </div>
</body>
</html>