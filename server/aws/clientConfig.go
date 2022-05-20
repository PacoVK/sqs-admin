package aws

import (
	"context"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/sqs"
)

var localStackResolver = aws.EndpointResolverWithOptionsFunc(func(service, region string, options ...interface{}) (aws.Endpoint, error) {
	return aws.Endpoint{
		PartitionID:   "aws",
		URL:           "http://localhost:4566",
		SigningRegion: "eu-central-1",
	}, nil
})

var awsConfig, _ = config.LoadDefaultConfig(context.TODO(),
	config.WithCredentialsProvider(
		credentials.NewStaticCredentialsProvider("Fake", "SECRET_KEY", "TOKEN"),
	),
	config.WithEndpointResolverWithOptions(localStackResolver),
	config.WithRegion("eu-central-1"),
)

var sqsClient = sqs.NewFromConfig(awsConfig)
