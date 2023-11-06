import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { BadRequestException, Body, Controller, HttpCode, Param, Put } from '@nestjs/common'
import { z } from 'zod'

const editAnswerBodySchema = z.object({
    content: z.string(),
})

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>

@Controller('/answers/:id')
export class EditAnswerController {
    constructor(private editAnswer: EditAnswerUseCase) { }

    @Put()
    @HttpCode(204)
    async handle(
        @Body(new ZodValidationPipe(editAnswerBodySchema))
        body: EditAnswerBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('id') answerId: string
    ) {
        const { content } = body
        const { sub: userId } = user

        const result = await this.editAnswer.execute({
            answerId,
            content,
            authorId: userId,
            attachmentsIds: [],
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
