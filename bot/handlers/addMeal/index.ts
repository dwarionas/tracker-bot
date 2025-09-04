import { Bot, Keyboard } from "grammy";
import type { MyContext } from "../../types/types.js";
import { Menu, type MenuFlavor } from "@grammyjs/menu";
import { initialKeyboard } from "../../commands/start.js";
import type { Message } from "grammy/types";
import onlyState from "../../service/onlyState.js";
import { back, navigate } from "../../service/navigation.js";

type MenuCtx = MyContext & MenuFlavor;

const onExit = async (ctx: MenuCtx) => {
    // ctx.session.currentMenu = '';
    ctx.menu.close();
    await ctx.editMessageText('Додано: ')
    await ctx.reply('Додай новий прийом їжі', { reply_markup: initialKeyboard });
}

export const crudMenu = new Menu<MenuCtx>('crud-menu', { onMenuOutdated: false })
	.text('Вибрати продукт зі збережених', ctx => {
        // ctx.session.currentMenu = "add-protein-menu";
        ctx.menu.nav('products-menu');
        ctx.editMessageText('Список продуктів');
    }).row()
    .text('Вийти', onExit)

const productsMenu = new Menu<MenuCtx>('products-menu')
	.submenu('Редагувати список продуктів', 'edit-products-menu').row()
	.back("Назад")
    .text('Готово', onExit)

const editProductsList = new Menu<MenuCtx>('edit-products-menu')
	.text('Зберегти').row()
	.back('Назад')
    .text('Готово', onExit)

crudMenu.register(productsMenu);
productsMenu.register(editProductsList);




export function crudHandler(bot: Bot<MyContext>) {
    bot.hears('Додати прийом їжі', onlyState(['initial']), navigate('addMeal'), async ctx => {
        await ctx.conversation.enter("addMeal");
    });

    bot.hears('Вибрати зі збережених', onlyState(['addMeal']), async ctx => {
        
    });

    bot.hears('Вийти', onlyState(["addMeal"]), back({ toBegin: true }), async ctx => {
        await ctx.reply('Додано: , Кількість білку за сьогодні: ', { reply_markup: initialKeyboard });
        // await ctx.api.deleteMessage(ctx.chat!.id, sent.message_id);
        ctx.deleteMessage();
    });
}