import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { Prisma } from '@prisma/client'

export class PrismaAttachmentMapper {
    static toPrisma(attachement: Attachment): Prisma.AttachmentUncheckedCreateInput {
        return {
            id: attachement.id.toString(),
            title: attachement.title,
            url: attachement.url,
        }
    }
}
