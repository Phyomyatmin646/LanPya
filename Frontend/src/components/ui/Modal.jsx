import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[#1F2328]/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full ${maxWidth} transform overflow-hidden bg-white gh-border rounded-md text-left align-middle shadow-xl transition-all`}>
                <div className="flex items-center justify-between px-4 py-3 bg-[#F6F8FA] border-b border-[#D0D7DE]">
                  <Dialog.Title as="h3" className="text-sm font-semibold text-[#24292F]">
                    {title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-[#57606A] hover:text-[#24292F] transition-colors rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', isDestructive = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="mt-2 text-sm text-[#57606A]">
        {message}
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="btn btn-default">
          Cancel
        </button>
        <button onClick={() => { onConfirm(); onClose(); }} className={`btn ${isDestructive ? 'btn-danger' : 'btn-primary'}`}>
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
