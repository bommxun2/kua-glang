const { ScanCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const client = require("../../utils/database");

const deleteShare = async (req, res) => {
  const { shareId } = req.params;

  try {
    
    //console.log("Deleting shareId:", shareId);

    const scanResult = await client.send(new ScanCommand({
      TableName: 'kua-glang'
    }));

    const itemsToDelete = scanResult.Items.filter(item =>
      item.PK.S === `SHARE#${shareId}` || item.SK.S === `SHARE#${shareId}`
    );

    if (itemsToDelete.length === 0) {
      return res.status(404).json({ error: 'No items found for this shareId.' });
    }

    await Promise.all(itemsToDelete.map(item =>
      client.send(new DeleteItemCommand({
        TableName: 'kua-glang',
        Key: {
          PK: item.PK,
          SK: item.SK
        }
      }))
    ));

    res.json({ message: 'All related items deleted successfully.' });

  } catch (err) {
    console.error('Delete share failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = deleteShare;
