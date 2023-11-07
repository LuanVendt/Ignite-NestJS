
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common'
import { z } from 'zod'
import { CommentPresenter } from '../presenters/comment-presenter'

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PegeQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
    constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) { }

    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PegeQueryParamSchema,
        @Param('answerId') answerId: string
    ) {
        const result = await this.fetchAnswerComments.execute({
            page,
            answerId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }


        const answerComments = result.value.answerComments

        return { comments: answerComments.map(CommentPresenter.toHTTP) }
    }
}

