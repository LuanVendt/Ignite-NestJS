import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repositoty'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentRepository
{
  public items: QuestionAttachment[] = []

  async findManyByQuestionId(questionId: string) {
    const questionAttachment = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    )
    return questionAttachment
  }

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    const questionAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.items = questionAttachments
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    )

    this.items = questionAttachments
  }
}
