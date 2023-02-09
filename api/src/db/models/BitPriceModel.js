import { model, Schema } from 'mongoose';

const schema = new Schema(
  {
    symbol: { type: String, required: true },
    bidPrice: { type: String, required: true },
    bidQty: { type: String, required: true },
    askPrice: { type: String, required: true },
    askQty: { type: String, required: true },
    time: { type: String, required: true },
  },
  { timestamps: true }
);

const BitPriceModel = model('bitprice', schema);

export default BitPriceModel;
