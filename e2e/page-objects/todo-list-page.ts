/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class ToDoListHomePage {

  private readonly page_path = 'https://todomvc.com/examples/react/#/';
  private readonly addNew_css = 'input.new-todo';
  private readonly itemCounter_css = 'footer span.todo-count';
  private readonly toggleAll_css = 'input.toggle-all';
  private readonly toggle_css = 'input.toggle';
  private readonly remove_css = 'button.destroy';
  private readonly listItem_css = 'ul.todo-list li';
  private readonly listItemInput_css = 'input.edit';
  private readonly listItemEdit_css = 'li.editing input.edit';
  private readonly allLink_textual = 'a:text=All';
  private readonly activeLink_textual = 'a:text=Active';
  private readonly completedLink_textual = 'a:text=Completed';
  private readonly clearCompleted_css = 'button.clear-completed';

  private readonly homepage: Page;
  private readonly addNew: Locator;
  private readonly itemCounter: Locator;
  private readonly toggleAll: Locator;
  private readonly toggle: Locator;
  private readonly remove: Locator;
  private readonly listItemInput: Locator;
  private readonly listItem: Locator;
  private readonly listItemEditing: Locator;
  private readonly allLink: Locator;
  private readonly activeLink: Locator;
  private readonly completedLink: Locator;
  private readonly clearCompleted: Locator;

  constructor(page: Page){
    this.homepage = page;
    this.addNew = page.locator(this.addNew_css);
    this.itemCounter = page.locator(this.itemCounter_css);
    this.toggleAll = page.locator(this.toggleAll_css);
    this.listItemInput = page.locator(this.listItemInput_css);
    this.listItem = page.locator(this.listItem_css);
    this.listItemEditing = page.locator(this.listItemEdit_css);
    this.remove = page.locator(this.remove_css);
  }

  async goTo() {
    this.homepage.goto(this.page_path);
    await expect(this.addNew).toBeVisible();
  }

  async addNewToDo(task: string) {
    await this.addNew.focus();
    await this.addNew.type(task);
    await this.homepage.keyboard.press('Enter');
  }

  async getNumberOfTasksLeft(){
    const num = await(this.itemCounter.innerText());
    return (await num).split(' ')[0];
  }

  async getLastTask() {
    const lastItem = await this.listItemInput.last();
    return await(lastItem.inputValue());
  }

  async updateSelectedTask(beforeTask: string, afterTask: string) {
    const listItem = await(this.__getListObject(beforeTask));
    await listItem.click({ clickCount: 2 });

    await this.listItemEditing.clear();
    await this.listItemEditing.type(afterTask);
    await this.homepage.keyboard.press('Enter');
  }

  private async  __getListObject(itemName: string) {
    return await(this.listItem.getByText(itemName));
  }

  async isTaskPresent(itemName: string) {
    const loc = ">> text='" + itemName + "'";
    const tasks = await this.homepage.$$(this.listItem_css + loc);
    if (tasks.length > 0)
      return true;
    else
      return false;
  }

  async removeTask(itemName: string) {
    const listItemToRemove = await (this.__getListObject(itemName));
    await(listItemToRemove.hover());
    const removeButtonXpath = "//ul/li/div/label[text()='" + itemName + "']/../..//button";
    const removeButton = await this.homepage.$(removeButtonXpath);
    removeButton.evaluate((node: HTMLElement) => { node.click(); });
  }

}
