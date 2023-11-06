import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { BadRequestException, Body, Controller, HttpCode, Param, Put } from '@nestjs/common'
import { z } from 'zod'

const editQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
})

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

@Controller('/questions/:id')
export class EditQuestionController {
    constructor(private editQuestion: EditQuestionUseCase) { }

    @Put()
    @HttpCode(204)
    async handle(
        @Body(new ZodValidationPipe(editQuestionBodySchema))
        body: EditQuestionBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('id') questionId: string
    ) {
        const { title, content } = body
        const { sub: userId } = user

        const result = await this.editQuestion.execute({
            title,
            content,
            authorId: userId,
            attachmentsIds: [],
            questionId
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}