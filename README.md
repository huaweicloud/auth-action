# Authenticate to Huawei Cloud

华为云统一鉴权Action。此Action配置访问华为云时的身份凭证AK/SK(Access Key ID/Secret Access Key)，区域region, 项目ID project id环境变量并对访问密钥AKSK进行身份验证，以便在其他GitHub Actions操作中使用。  

## 前置条件
华为云统一鉴权Action需要了解[华为云统一身份认证服务](https://support.huaweicloud.com/iam/index.html)(Identity and Access Management，简称IAM)。  
1. [IAM基本概念](https://support.huaweicloud.com/productdesc-iam/iam_01_0023.html)  
2. [管理IAM用户访问密钥(AK/SK)](https://support.huaweicloud.com/usermanual-iam/iam_02_0003.html)  
3. [华为云区域(region)](https://support.huaweicloud.com/iam_faq/iam_01_0011.html)  
4. [华为云项目(project id)](https://support.huaweicloud.com/usermanual-iam/iam_05_0001.html)  

## 参数  

| Name          | Require | Default | Description |
| ------------- | ------- | ------- | ----------- |
| access_key_id    |   true    |         | 华为云访问密钥ID即AK,可以在[我的凭证](https://support.huaweicloud.com/usermanual-ca/ca_01_0003.html?utm_campaign=ua&utm_content=ca&utm_term=console)获取。建议在GitHub项目的setting--Secret--Actions下添加 ACCESSKEY 参数|
| secret_access_key    |   true    |         | 华为云访问密钥即SK,可以在[我的凭证](https://support.huaweicloud.com/usermanual-ca/ca_01_0003.html?utm_campaign=ua&utm_content=ca&utm_term=console)获取。建议在GitHub项目的setting--Secret--Actions下添加SECRETACCESSKEY 参数|
| region    |   true        |     cn-north-4    | 华为云区域，可以在[我的凭证](https://console.huaweicloud.com/iam/?locale=zh-cn#/mine/apiCredential)获取|
| project_id    |   false    |         | 华为云项目ID，可以在[我的凭证](https://console.huaweicloud.com/iam/?locale=zh-cn#/mine/apiCredential)获取|  


## 使用
### 1.简单例子
在GitHub Workflow中添加下面的步骤
```yaml
    - name: Authenticate to Huawei Cloud
      uses: huaweicloud/auth-action@v1.0.0
      with: 
          access_key: ${{ secrets.ACCESSKEY }} 
          secret_key: ${{ secrets.SECRETACCESSKEY }}
          region: 'cn-north-4'
    # 下面使用华为云Actions的步骤会自动鉴权
```  
### 2.使用统一鉴权前后对比例子
使用前的workflow
```yaml
jobs:
  workflow_demo:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

    # 使用华为云命令行工具KooCLI
      - name: List Versions of ECS With Default Region By KooCLI 
        uses: huaweicloud/huaweicloud-cli-action@v1.0.1
        with:
          access_key: ${{ secrets.ACCESSKEY }}
          secret_key: ${{ secrets.SECRETACCESSKEY }}
          region: 'cn-north-4'
          commandList: 'hcloud ECS NovaListVersions'
      
      # 上传文件到华为云OBS
      - name: Upload To HuaweiCloud OBS
        uses: huaweicloud/obs-helper@v1.2.0
        id: upload_file_to_obs
        with:
          access_key: ${{ secrets.ACCESSKEY }}
          secret_key: ${{ secrets.SECRETACCESSKEY }}
          region: 'cn-north-4'
          bucket_name: 'bucket-test'
          local_file_path: 'src1/src2/test1.txt'
          obs_file_path: ''
          operation_type: 'upload'
      # 下面使用华为云Actions的步骤会自动鉴权
      - name: deploy serverless function to huaweicloud functiongraph by obs
        uses: huaweicloud/deploy-functiongraph-action@v1.0
        with:
            ak: ${{ secrets.ACCESSKEY }}
            sk: ${{ secrets.SECRETACCESSKEY }}
            endpoint: https://functiongraph.cn-north-4.myhuaweicloud.com
            project_id: '<project_id>'
            function_urn: urn:fss:cn-north-4:<project_id>:function:default:${{ secrets.FUNCTIONNAME}}:latest
            function_codetype: obs
            function_file: "https://huaweihdnbucket.obs.cn-north-4.myhuaweicloud.com/function/publishmarket/index_obs.zip"
``` 
使用后的workflow
```yaml
jobs:
  workflow_demo:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Authenticate to Huawei Cloud
        uses: huaweicloud/auth-action@v1.0.0
        with: 
            access_key: ${{ secrets.ACCESSKEY }} 
            secret_key: ${{ secrets.SECRETACCESSKEY }}
            region: 'cn-north-4'
            project_id: '<project_id>'

    # 使用华为云命令行工具KooCLI
      - name: List Versions of ECS With Default Region By KooCLI 
        uses: huaweicloud/huaweicloud-cli-action@v1.0.1
        with:
          commandList: 'hcloud ECS NovaListVersions'
      
      # 上传文件到华为云OBS
      - name: Upload To HuaweiCloud OBS
        uses: huaweicloud/obs-helper@v1.2.0
        id: upload_file_to_obs
        with:
          bucket_name: 'bucket-test'
          local_file_path: 'src1/src2/test1.txt'
          obs_file_path: ''
          operation_type: 'upload'
      # 部署华为云函数
      - name: deploy serverless function to huaweicloud functiongraph by obs
        uses: huaweicloud/deploy-functiongraph-action@v1.0
        with:
            endpoint: https://functiongraph.cn-north-4.myhuaweicloud.com
            function_urn: urn:fss:cn-north-4:<project_id>:function:default:${{ secrets.FUNCTIONNAME}}:latest
            function_codetype: obs
            function_file: "https://huaweihdnbucket.obs.cn-north-4.myhuaweicloud.com/function/publishmarket/index_obs.zip"

``` 
从上面是否使用华为云统一鉴权Action对比可以看出，使用统计鉴权action之后华为云的GitHub Action步骤会自动鉴权,不需要在每个step输入鉴权信息