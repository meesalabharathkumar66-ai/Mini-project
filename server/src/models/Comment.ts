import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  asset: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  text: string;
  isEdited: boolean;
  replies: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
  asset: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  isEdited: { type: Boolean, default: false },
  replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

CommentSchema.index({ asset: 1, createdAt: -1 });

export default mongoose.model<IComment>('Comment', CommentSchema);
