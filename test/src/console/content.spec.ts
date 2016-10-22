// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import expect = require('expect.js');

import {
  utils, Session
} from '@jupyterlab/services';

import {
  CodeMirrorConsoleRenderer
} from '../../../lib/console/codemirror/widget';

import {
  ConsoleContent
} from '../../../lib/console/content';

import {
  InspectionHandler
} from '../../../lib/inspector';

import {
  CodeCellWidget
} from '../../../lib/notebook/cells';

import {
  defaultRenderMime
} from '../utils';


const CONSOLE_CLASS = 'jp-ConsoleContent';
const renderer = CodeMirrorConsoleRenderer.defaultRenderer;
const rendermime = defaultRenderMime();


describe('console/content', () => {

  describe('ConsoleContent', () => {

    describe('#constructor()', () => {

      it('should create a new console content widget', done => {
        Session.startNew({ path: utils.uuid() }).then(session => {
          let widget = new ConsoleContent({ renderer, rendermime, session });
          expect(widget).to.be.a(ConsoleContent);
          expect(widget.node.classList.contains(CONSOLE_CLASS)).to.be(true);
          widget.dispose();
          done();
        });
      });

    });

    describe('#executed', () => {

      it('should emit a date upon execution', done => {
        Session.startNew({ path: utils.uuid() }).then(session => {
          let widget = new ConsoleContent({ renderer, rendermime, session });
          let called: Date = null;
          let force = true;
          widget.executed.connect((sender, time) => { called = time; });
          widget.execute(force).then(() => {
            expect(called).to.be.a(Date);
            widget.dispose();
            done();
          });
        });
      });

    });

    describe('#inspectionHandler', () => {

      it('should exist after instantiation', done => {
        Session.startNew({ path: utils.uuid() }).then(session => {
          let widget = new ConsoleContent({ renderer, rendermime, session });
          expect(widget.inspectionHandler).to.be.an(InspectionHandler);
          widget.dispose();
          done();
        });
      });

    });

    describe('#prompt', () => {

      it('should be a code cell widget', done => {
        Session.startNew({ path: utils.uuid() }).then(session => {
          let widget = new ConsoleContent({ renderer, rendermime, session });
          expect(widget.prompt).to.be.a(CodeCellWidget);
          widget.dispose();
          done();
        });
      });

      it('should be be replaced after execution', done => {
        Session.startNew({ path: utils.uuid() }).then(session => {
          let widget = new ConsoleContent({ renderer, rendermime, session });
          let old = widget.prompt;
          let force = true;
          expect(old).to.be.a(CodeCellWidget);
          widget.execute(force).then(() => {
            expect(widget.prompt).to.be.a(CodeCellWidget);
            expect(widget.prompt).to.not.be(old);
            widget.dispose();
            done();
          });
        });
      });

    });

    describe('#session', () => {

      it('should return the session passed in at instantiation', done => {
        Session.startNew({ path: utils.uuid() }).then(session => {
          let widget = new ConsoleContent({ renderer, rendermime, session });
          expect(widget.session).to.be(session);
          widget.dispose();
          done();
        });
      });

    });

    describe('#clear()', () => {

      it('should clear all of the content cells except the banner', done => {
        Session.startNew({ path: utils.uuid() }).then(session => {
          let widget = new ConsoleContent({ renderer, rendermime, session });
          let force = true;
          widget.execute(force).then(() => {
            expect(widget.content.widgets.length).to.be.greaterThan(1);
            widget.clear();
            expect(widget.content.widgets.length).to.be(1);
            widget.dispose();
            done();
          });
        });
      });

    });

    describe('#dispose()', () => {

      it('should dispose the content widget', done => {
        Session.startNew({ path: utils.uuid() }).then(session => {
          let widget = new ConsoleContent({ renderer, rendermime, session });
          expect(widget.isDisposed).to.be(false);
          widget.dispose();
          expect(widget.isDisposed).to.be(true);
          done();
        });
      });

      it('should be safe to dispose multiple times', done => {
        Session.startNew({ path: utils.uuid() }).then(session => {
          let widget = new ConsoleContent({ renderer, rendermime, session });
          expect(widget.isDisposed).to.be(false);
          widget.dispose();
          widget.dispose();
          expect(widget.isDisposed).to.be(true);
          done();
        });
      });

    });

  });

});
