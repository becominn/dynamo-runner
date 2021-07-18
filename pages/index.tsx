import Head from 'next/head'
import styles from '../styles/Home.module.css'
import * as aws from "aws-sdk"

const Region = process.env.REGION!;
const TableName = process.env.TABLE_NAME!;
const dynamodb = new aws.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: Region,
  signatureVersion: "v4",
});

type Props = {
  message: String;
}

const View = ({message}: Props) => {
  console.log("massage:", message);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
  
      <main className={styles.main}>
        <h1 className={styles.title}>
          <a>{message}</a>
        </h1>
      </main>
    </div>
  )
};

export default View;

type Record = {
  key: string;
  message: string;
}

export const getServerSideProps = async () => {
  const result = await dynamodb
    .query({
      TableName: TableName,
      Limit: 1,
      KeyConditionExpression: "#key = :key",
      ExpressionAttributeNames:{
        "#key": "key"
      },
      ExpressionAttributeValues: {
        ":key": "1"
      }
    })
    .promise();

    const record: Record = result.Items![0] as Record;
    const message: String = record.message as String;
    
    return { props: { message } };
}
