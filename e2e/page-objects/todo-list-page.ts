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

  private readonly homepage: Page;
  private readonly addNew: Locator;
  private itemCounter: Locator;

  constructor(page: Page){
    this.homepage = page;
    this.addNew = page.locator(this.addNew_css);
    this.itemCounter = page.locator(this.itemCounter_css);
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
}
