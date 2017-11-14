import React from 'react';
import Breadcrumb from './Breadcrumb';
import ExampleSource from 'steadicam/components/styleListings/ExampleSource/ExampleSource';
import { ParagraphMd } from '../Type';

class BreadcrumbDocs extends React.Component {
    render() {
        return (
            <div className="Pattern__docs">
                <ParagraphMd>Breadcrumbs help orient the user within an page flow.</ParagraphMd>
                <ParagraphMd>"Crumb" links are passed as an array of object to <code>crumbs</code> and the current page label should be passed to <code>currentPageLabel</code> as a string.</ParagraphMd>
                <ParagraphMd>Below our medium breakpoint only the current page label will show, but there will be a linked arrow that will get link properties from the last breadcrump in the <code>crumbs</code> array.</ParagraphMd>

                <div data-code>
                    <Breadcrumb
                        crumbs = {[
                            {
                                label: 'Breadcrumb Item 1 is Pretty Long So Cut it Off',
                                href: '#',
                            },
                            {
                                label: 'Breadcrumb Item 2',
                                href: '#',
                                onClick: (e) => {
                                    e.preventDefault();
                                    console.log('click');
                                },
                            },
                        ]}
                        currentPageLabel="Current Page Label is Pretty Long So Cut it Off"
                    />
                </div>

                <ExampleSource>
                    {`
<Breadcrumb
    crumbs = {[
        {
            label: 'Breadcrumb Item 1 is Pretty Long So Cut it Off',
            href: '#',
        },
        {
            label: 'Breadcrumb Item 2',
            href: '#',
            onClick: (e) => {
                e.preventDefault();
                console.log('click');
            },
        },
    ]}
    currentPageLabel="Current Page Label is Pretty Long So Cut it Off"
/>
                        `}
                    </ExampleSource>
                </div>
        );
    }
}

export default BreadcrumbDocs;
