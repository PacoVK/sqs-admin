package aws

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/sqs"
	"github.com/pacoVK/utils"
)

var localStackResolver = aws.EndpointResolverWithOptionsFunc(func(service, region string, options ...interface{}) (aws.Endpoint, error) {
	awsEndpoint := aws.Endpoint{
		PartitionID:   "aws",
		SigningRegion: utils.GetEnv("SQS_AWS_REGION", "eu-central-1"),
	}

	endpointUrl := utils.GetEnv("SQS_ENDPOINT_URL", "")

	if endpointUrl != "" {
		awsEndpoint.URL = endpointUrl
	}

	return awsEndpoint, nil
})

var awsConfig, _ = config.LoadDefaultConfig(context.TODO(),
	config.WithCredentialsProvider(
		credentials.NewStaticCredentialsProvider(
			utils.GetEnv("SQS_ACCESS_KEY_ID", "ACCESS_KEY"),
			utils.GetEnv("SQS_SECRET_ACCESS_KEY", "SECRET_KEY"),
			utils.GetEnv("SQS_SESSION_TOKEN", "TOKEN"),
		),
	),
	config.WithEndpointResolverWithOptions(localStackResolver),
	config.WithRegion(
		utils.GetEnv("SQS_AWS_REGION", "eu-central-1"),
	),
)

var sqsClient = sqs.NewFromConfig(awsConfig)
